package com.blog.backend.report.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.report.dto.ReportDto;
import com.blog.backend.report.mapper.ReportMapper;
import com.blog.backend.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ReportMapper reportMapper;

    @PostMapping("/api/users/{username}/report")
    public ResponseEntity<Void> reportUser(
            @PathVariable String username,
            @RequestParam("reason") String reason,
            @RequestParam(value = "postId", required = false) Long postId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        reportService.reportUser(userDetails.getUser(), username, reason, postId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/api/admin/reports")
    public ResponseEntity<Page<ReportDto>> getAllReports(@PageableDefault(size = 20) Pageable pageable) {
        Page<ReportDto> reports = reportService.getAllReports(pageable).map(reportMapper::toDto);
        return ResponseEntity.ok(reports);
    }
}