package com.blog.backend.user.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileDto {
    private Long id;
    private String username;
    private String bio;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private boolean owner;
    private boolean subscribed;
}