package com.blog.backend.post.dto; // <<==>> \\ // <> \\  
import java.time.LocalDateTime; // <<==>> \\ (<!!>)

public record AdminPostDto(
    Long id,
    String title,
    String authorUsername,
    LocalDateTime createdAt
) {}