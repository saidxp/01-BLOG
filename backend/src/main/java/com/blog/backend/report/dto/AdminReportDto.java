package com.blog.backend.report.dto;

import java.time.LocalDateTime;

public record AdminReportDto(
    Long id,
    String reporterUsername,
    String reportedUsername,
    String reason,
    LocalDateTime createdAt
) {}