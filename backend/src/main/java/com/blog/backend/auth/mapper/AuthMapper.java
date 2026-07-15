package com.blog.backend.auth.mapper;

import com.blog.backend.auth.dto.response.LoginResponse;
import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper { 
    //  I Can More Opitimise This Mapper Later !! ()()
    public RegisterResponse toRegisterResponse(User user) {
        return RegisterResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    // I CAN OPTIMISE THIS MAPPER LATER     ((!!)) 
    public LoginResponse toLoginResponse(User user, String accessToken) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .build();
    }

}

