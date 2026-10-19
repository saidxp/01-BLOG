package com.blog.backend.user.dto;

public record UserSearchResultDto(
        Long id,
        String username,
        String avatarUrl
) {
}