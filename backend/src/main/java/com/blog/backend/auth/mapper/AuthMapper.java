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
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
    
    // I CAN OPTIMISE THIS MAPPER LATER (!!)
    public LoginResponse toLoginResponse(String accessToken) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .build();
    }

}