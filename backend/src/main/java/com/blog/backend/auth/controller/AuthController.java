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
import com.blog.backend.auth.cookie.AuthCookieService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;
    
    // <<<===>>> \\
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request, HttpServletResponse res) {
        Pair<RegisterResponse, String> result = authService.register(request); 
        authCookieService.setAccessTokenCookie(res, result.getRight());
        return ResponseEntity.status(HttpStatus.CREATED).body(result.getLeft());
    }

    // <<<===>>> \\ 
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest request ,  HttpServletResponse res) {
        Pair<LoginResponse, String> result = authService.login(request); 
        authCookieService.setAccessTokenCookie(res, result.getRight());
        return ResponseEntity.status(HttpStatus.OK).body(result.getLeft());
    }
}

