package com.blog.backend.user.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicUserDto {
    private String username;
    private LocalDateTime createdAt;
    // later: private List<PostDto> posts;  (added once Task 5 exists)
}