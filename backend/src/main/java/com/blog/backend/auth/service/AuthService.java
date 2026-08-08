package com.blog.backend.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.backend.auth.dto.request.LoginRequest;
import com.blog.backend.auth.dto.request.RegisterRequest;
import com.blog.backend.auth.dto.response.LoginResponse;
import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.auth.mapper.AuthMapper;
import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.auth.security.JwtService;
import com.blog.backend.exception.InvalidCredentialsException;
import com.blog.backend.exception.UserAlreadyExistsException;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    // still 
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final Normalizer normalizer;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String normalizedUsername = normalizer.normalizeUsername(request.getUsername());
        String normalizedEmail = normalizer.normalizeEmail(request.getEmail());

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new UserAlreadyExistsException("Username Is Already Taken");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new UserAlreadyExistsException("Email Is Already Registered");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .username(normalizedUsername)
                .email(normalizedEmail)
                .passwordHash(passwordHash)
                .build();

        User savedUser = userRepository.save(user);

        return authMapper.toRegisterResponse(savedUser);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {

        String identifier = normalizer.normalizeUsername(request.getIdentifier());

        Authentication authentication
                = new UsernamePasswordAuthenticationToken(
                        identifier,
                        request.getPassword()
                );

        Authentication authenticated;

        try {
            authenticated = authenticationManager.authenticate(authentication);
        } catch (BadCredentialsException e) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        CustomUserDetails principal
                = (CustomUserDetails) authenticated.getPrincipal();

        String token = jwtService.generateAccessToken(principal);

        return authMapper.toLoginResponse(token);
    }
}
