package com.blog.backend.user.dto; 
import com.blog.backend.user.enums.*; 
import java.time.LocalDateTime;

public record AdminUserDto(
    Long id,
    String username,
    String email,
    Role role,
    UserStatus status,
    LocalDateTime createdAt
) {}