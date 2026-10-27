package com.blog.backend.auth.cookie;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
@Component
public class AuthCookieService {
    // Secure flag follows the app.cookie.secure property (true in production/HTTPS)
    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    public void setAccessTokenCookie(
            HttpServletResponse response,
            String accessToken) {

        ResponseCookie cookie = ResponseCookie.from("jwt", accessToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );
    }

    // Clears the auth cookie on logout / session reset, honoring the same Secure flag
    public void clearAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );
    }
}