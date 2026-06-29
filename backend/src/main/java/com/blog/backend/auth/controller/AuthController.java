package com.blog.backend.auth.controller;

import com.blog.backend.auth.dto.request.RegisterRequest;
import com.blog.backend.auth.dto.request.LoginRequest;
import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.auth.dto.response.LoginResponse;
import com.blog.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } 

    // <<<===>>> \\ 
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest request) {
        // Will be implemented later in AuthService !!
        LoginResponse response = authService.login(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}

