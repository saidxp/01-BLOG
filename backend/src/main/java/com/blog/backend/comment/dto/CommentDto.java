package com.blog.backend.comment.dto;

import java.time.LocalDateTime;

public record CommentDto(Long id, String authorUsername, String content, LocalDateTime createdAt, boolean canDelete) {
     
}