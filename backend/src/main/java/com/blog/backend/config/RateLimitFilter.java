package com.blog.backend.config;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog.backend.config.RateLimitProperties.Rule;
import com.blog.backend.exception.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Layer 2 rate limiter.
 *
 * Idea: every caller gets their OWN boxes (Buckets).
 *   - one GLOBAL box  : "how much total this person may do"
 *   - one DOOR box    : "how much of THIS action (auth/write/read) this person may do"
 * A request spends 1 token from BOTH boxes; if either is empty we answer 429 and
 * the request never reaches the controller / database.
 *
 * Boxes are stored per key in ConcurrentHashMaps and created lazily on first sight.
 * Key = "u:&lt;username&gt;" when authenticated, else "ip:&lt;address&gt;" (see SecurityConfig:
 * this filter runs AFTER JwtAuthenticationFilter, so the user is already resolved).
 */
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties props;
    private final ObjectMapper objectMapper;
    private final AntPathMatcher matcher = new AntPathMatcher();

    // THE BOXES. key (who / who+door) -> Bucket (the token holder). Thread-safe.
    private final ConcurrentHashMap<String, Bucket> globalBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Bucket> doorBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String path = req.getServletPath();

        // Not our business (disabled, or a non-API path like /media, swagger, /error) -> pass through.
        if (!props.isEnabled() || !path.startsWith("/api/")) {
            chain.doFilter(req, res);
            return;
        }

        // 1) WHO is this? authenticated user, otherwise their IP.
        String key = resolveKey(req);

        // 2) GLOBAL box: reuse this person's box, or build a fresh one the first time we see them.
        Bucket globalBox = globalBuckets.computeIfAbsent(key,
                k -> newBucket(props.getGlobalCapacity(), props.getGlobalRefillPerMinute()));

        // 3) SPEND 1 token from the global box. Empty -> they must wait -> 429, stop here.
        if (!globalBox.tryConsume(1)) {
            writeTooManyRequests(res, 60);
            return;
        }

        // 4) Which DOOR (rule) does this request match? (auth / write / read)
        Rule rule = matchRule(req.getMethod(), path);

        // 5) If a door applies, SPEND 1 token from THAT DOOR's box (its own box, keyed user+door).
        if (rule != null) {
            Bucket doorBox = doorBuckets.computeIfAbsent(key + ":" + rule.getName(),
                    k -> newBucket(rule.getCapacity(), rule.getRefillPerMinute()));
            if (!doorBox.tryConsume(1)) {
                writeTooManyRequests(res, secondsUntilNextToken(rule));
                return;
            }
        }

        // 6) Both boxes still had tokens -> allow, continue to the controller.
        chain.doFilter(req, res);
    }

    // Authenticated => "u:<username>". Anonymous => "ip:<real client address>".
    private String resolveKey(HttpServletRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean realUser = auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);
        return realUser ? "u:" + auth.getName() : "ip:" + req.getRemoteAddr();
    }

    // First rule whose path pattern AND method match wins (yaml order = priority: auth before /api/**).
    private Rule matchRule(String method, String path) {
        for (Rule rule : props.getRules()) {
            boolean pathMatches = matcher.match(rule.getMatch(), path);
            boolean methodMatches = rule.getMethods().isEmpty() || rule.getMethods().contains(method);
            if (pathMatches && methodMatches) {
                return rule;
            }
        }
        return null;
    }

    // BUILD A BOX: capacity = max tokens; refillGreedy = tokens drip back over one minute.
    private Bucket newBucket(long capacity, long refillPerMinute) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(capacity)
                .refillGreedy(refillPerMinute, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    // Rough "how long until ~1 token is back": 60 / perMinute. auth(5/min) -> ~12s.
    private long secondsUntilNextToken(RateLimitProperties.Rule rule) {
        long perMinute = Math.max(1, rule.getRefillPerMinute());
        return Math.max(1, 60 / perMinute);
    }

    // The "slow down" answer, reusing the SAME JSON envelope as other errors so Angular shows a toast.
    private void writeTooManyRequests(HttpServletResponse res, long retryAfterSeconds) throws IOException {
        res.setStatus(429);
        res.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        ApiErrorResponse body = ApiErrorResponse.builder()
                .status(429)
                .message("Too many requests. Please slow down and try again shortly.")
                .timestamp(LocalDateTime.now())
                .build();

        res.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
