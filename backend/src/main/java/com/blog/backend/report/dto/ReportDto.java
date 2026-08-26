package com.blog.backend.report.dto;

import java.time.LocalDateTime;

public record ReportDto(
        Long id,
        String reporterUsername,
        String reportedUsername,
        Long postId, 
        String reason,
        LocalDateTime createdAt
) {
}