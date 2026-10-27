package com.blog.backend.report.dto;

import java.time.LocalDateTime;
import com.blog.backend.report.enums.ReportStatus;
import com.blog.backend.report.enums.ReportType;;
public record ReportDto(
        Long id,
        String reporterUsername,
        String reportedUsername,
        Long postId, 
        String reason,
        LocalDateTime createdAt,
        ReportStatus status,
        ReportType type
) {
}