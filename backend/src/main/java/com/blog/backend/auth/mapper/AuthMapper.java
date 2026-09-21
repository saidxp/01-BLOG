package com.blog.backend.auth.mapper;

import org.springframework.stereotype.Component;

import com.blog.backend.auth.dto.response.LoginResponse;
import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.user.model.User;

@Component
public class AuthMapper {

    //  I Can More Opitimise This Mapper Later (!!)
    public RegisterResponse toRegisterResponse(User user) {
        return RegisterResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }
    
    // I CAN OPTIMISE This MAPPER LATER (!!)
    public LoginResponse toLoginResponse(User user) {
        return LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl()) 
                .role(user.getRole())
                .build();
    }
    
}