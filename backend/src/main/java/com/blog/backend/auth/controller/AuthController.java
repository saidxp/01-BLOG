package com.blog.backend.auth.controller;

import com.blog.backend.auth.dto.request.RegisterRequest;
import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.auth.mapper.AuthMapper;
import com.blog.backend.auth.service.Normalizer;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthMapper authMapper;
    private final Normalizer normalizer;

    @PostMapping("/register")
    // Her It's will Be in http Request  it's http Package !! \
    // And We Use Here @Valid to Validate the Request Body before passing It to the Service
    // And @RequestBody to Convert the Json to Java Object !! <<=> !!(.)
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        request.setUsername(normalizer.normalizeUsername(request.getUsername()));
        request.setEmail(normalizer.normalizeEmail(request.getEmail()));
        
        UserDto registeredUser = userService.register(request);
        RegisterResponse response = authMapper.toRegisterResponse(registeredUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

