package com.blog.backend.auth.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog.backend.exception.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final ObjectMapper objectMapper;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        if ("/api/auth/clear-session".equals(path) ) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = jwtService.extractTokenFromCookie(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String username;
        Long tokenUserId;

        try {
            username = jwtService.extractUsername(token);
            tokenUserId = jwtService.extractUserId(token);

        } catch (JwtException e) {

            authenticationEntryPoint.commence(
                    request,
                    response,
                    new AuthenticationException("Invalid authentication token") {
                    });
            return;
        }

        // User is not authenticated yet !! Her I Will Put The User In The Security
        // Context (!!)
        if (username != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Prefer the database id from the "uid" claim; fall back to the
                // username lookup for tokens issued before the claim existed.
                UserDetails userDetails = tokenUserId != null
                        ? userDetailsService.loadUserById(tokenUserId)
                        : userDetailsService.loadUserByUsername(username);
                // <<===>> \\ <<==>> \\ (!<->!)....

                if (!userDetails.isAccountNonLocked() || !userDetails.isEnabled()) {
                    // Banned/disabled account: revoke the session cookie immediately and <!>
                    // short-circuit with 403 so no action can be performed with this token.
                    SecurityContextHolder.clearContext();
                    expireJwtCookie(response);
                    writeForbiddenResponse(response);
                    return;
                }
                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }

            } catch (UsernameNotFoundException ex) {

                SecurityContextHolder.clearContext();
                expireJwtCookie(response);
                filterChain.doFilter(request, response);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private void expireJwtCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void writeForbiddenResponse(HttpServletResponse response) throws IOException {
        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpServletResponse.SC_FORBIDDEN)
                .message("Your account has been banned")
                .timestamp(LocalDateTime.now())
                .build();
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
