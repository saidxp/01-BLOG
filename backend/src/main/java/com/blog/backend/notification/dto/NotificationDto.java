package com.blog.backend.notification.dto;

import java.time.LocalDateTime;

public record NotificationDto( 
    Long id,
    String message,
    Long postId,
    String authorUsername,
    String authorAvatarUrl,
    boolean read,
    LocalDateTime createdAt 
) {}