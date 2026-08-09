package com.blog.backend.user.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicUserDto {
    private String username;
    private LocalDateTime createdAt;
    private long subscriberCount;
    private long subscriptionCount;
    private boolean isSubscribed;   // does the CURRENT viewer follow this profile?
}