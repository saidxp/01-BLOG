package com.blog.backend.report.mapper;

import com.blog.backend.report.dto.ReportDto;
import com.blog.backend.report.model.Report;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {
    
    public ReportDto toDto(Report report) {

        Long postId = report.getPost() != null ? report.getPost().getId() : null;
        return new ReportDto(
                report.getId(),
                report.getReporter().getUsername(),
                report.getReportedUser().getUsername(),
                postId,
                report.getReason(),
                report.getCreatedAt()
        );
    }
}