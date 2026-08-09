package com.blog.backend.user.mapper;

import org.springframework.stereotype.Component; 

import com.blog.backend.user.dto.PublicUserDto;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.model.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    public PublicUserDto toPublicDto(User user) {
        return PublicUserDto.builder()
                .username(user.getUsername())
                .createdAt(user.getCreatedAt())
                .build();
    }
}