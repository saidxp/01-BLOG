package com.blog.backend.user.mapper;

import org.springframework.stereotype.Component;

import com.blog.backend.user.dto.UserProfileDto;
import com.blog.backend.user.dto.AdminUserDto;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.model.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }

    public UserProfileDto toPublicDto(User user, boolean isSubscribed, boolean isOwner) {
        return UserProfileDto.builder()
                .username(user.getUsername())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .subscribed(isSubscribed)
                .owner(isOwner)
                .build();
    } 

    // <<==>> \\ (<!<->!>) \\ <<==>> \\ (<!!>) \\ 
    public AdminUserDto toAdminUserDto(User user) {
        return new AdminUserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt());
    } //<<<==>>\\ (<!-!>)
}