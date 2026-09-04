package com.blog.backend.auth.cookie;

import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;

@Component
public class AuthCookieService {

    public void setAccessTokenCookie(
            HttpServletResponse response,
            String accessToken) {

        ResponseCookie cookie = ResponseCookie.from("jwt", accessToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );
    }
}