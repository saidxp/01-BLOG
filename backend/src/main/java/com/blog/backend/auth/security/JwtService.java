package com.blog.backend.auth.security;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.blog.backend.auth.config.JwtProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.Cookie;

@Service
@RequiredArgsConstructor
public class JwtService {

        private final JwtProperties jwtProperties;

        // Her i genrate a token to send it to client !!! after it's authenticated
        // successfully !!
        public String generateAccessToken(CustomUserDetails userDetails) {

                return Jwts.builder()
                                .subject(userDetails.getUsername())
                                .issuedAt(new Date())
                                .expiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + jwtProperties.getAccessTokenExpiration()))
                                .signWith(getSigningKey())
                                .compact();
        }

        // Get Signing Key From JwtProperties (!!) (!!)
        private SecretKey getSigningKey() {

                return Keys.hmacShaKeyFor(
                                jwtProperties.getSecret()
                                                .getBytes(StandardCharsets.UTF_8));

        }

        // I Will Use It When I Want To Validate The Token In The Future !! (Verify the
        // token)
        public String extractUsername(String token) {

                return Jwts.parser()
                                .verifyWith(getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload()
                                .getSubject();
        }

        // Extract Jwt From Header (!!). 
        public String extractTokenFromCookie(HttpServletRequest request) {
                Cookie[] cookies = request.getCookies();
                if (cookies == null) {
                        return null;
                }
                for (Cookie cookie : cookies) {
                        if ("jwt".equals(cookie.getName())) {
                                return cookie.getValue();
                        }
                }
                return null;
        }

        // I Will Use It When I Want To Validate The Token In The Future !! (Verify the
        // token)
        public boolean validateToken(String token,
                        UserDetails userDetails) {

                String username = extractUsername(token);
                return username.equals(userDetails.getUsername())
                                && !isTokenExpired(token);
        }
        
        // Notice Im Verify IT EVERY TIME !...
        private boolean isTokenExpired(String token) {
                Date expiration = Jwts.parser()
                                .verifyWith(getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload()
                                .getExpiration();

                return expiration.before(new Date());
        }
}
