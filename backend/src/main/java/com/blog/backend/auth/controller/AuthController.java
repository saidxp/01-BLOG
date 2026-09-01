package com.blog.backend.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.auth.dto.request.LoginRequest;
import com.blog.backend.auth.dto.request.RegisterRequest;
import com.blog.backend.auth.dto.response.LoginResponse;
import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.auth.service.AuthService;
import org.apache.commons.lang3.tuple.Pair;
import  java.time.Duration;
import org.springframework.http.HttpHeaders;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // <<<===>>> \\
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // <<<===>>> \\ 
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest request ,  HttpServletResponse res) {
        // Will be implemented later in AuthService (!!) (!!) \\ 
        Pair<LoginResponse, String> result = authService.login(request); 
        LoginResponse response = result.getLeft();
        String accessToken = result.getRight();

        ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
            .httpOnly(true)
            .secure(false)    // for now i will use http only, but in production, it should be true
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofHours(1))
            .build();

        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

