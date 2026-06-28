package com.blog.backend.user.service;

import com.blog.backend.exception.UserAlreadyExistsException;
import com.blog.backend.auth.dto.request.RegisterRequest;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Transactional
    public UserDto register(RegisterRequest request) { 
        // I Will Handle - Email , Username and Password <==> 
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user); /// <<====>> \\
        return UserDto.fromEntity(savedUser);
    }
}
