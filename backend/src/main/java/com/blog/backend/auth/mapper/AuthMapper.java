package com.blog.backend.auth.mapper;

import com.blog.backend.auth.dto.response.RegisterResponse;
import com.blog.backend.user.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    // Recive UserDto And Return RegisterResponse <<==>> !!(.)
    // make it simple now !!???  
    public RegisterResponse toRegisterResponse(UserDto userDto) {
        return RegisterResponse.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .build();
    }
    // <<<===>>> \\((!!)) \\ 
}

