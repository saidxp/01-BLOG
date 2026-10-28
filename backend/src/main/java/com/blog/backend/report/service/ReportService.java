package com.blog.backend.report.service;

import com.blog.backend.exception.PostNotFoundException;
import com.blog.backend.exception.SelfReportException;
import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.exception.ReportNotFoundException;
import com.blog.backend.exception.InvalidReportStateException;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.report.enums.ReportStatus;
import com.blog.backend.report.enums.ReportType;
import com.blog.backend.report.model.Report;
import com.blog.backend.report.repository.ReportRepository;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public void reportUser(User reporter, String reportedUsername, String reason, Long postId) {

        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Report reason must not be empty");
        }

        if (reason.trim().length() > 500) {
            throw new IllegalArgumentException("Report reason must not exceed 500 characters");
        }

        User reportedUser = userRepository.findByUsername(reportedUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + reportedUsername));

        if (reporter.getId().equals(reportedUser.getId())) {
            throw new SelfReportException("You cannot report yourself");
        }

        Report.ReportBuilder builder = Report.builder()
                .reporter(reporter)
                .reportedUser(reportedUser);
    
        ReportType reportType = ReportType.USER;
        if (postId != null) {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
            builder.post(post);
            reportType = ReportType.POST;
        }
        builder.reason(reason);
        builder.type(reportType);
        reportRepository.save(builder.build());
    }

    public Page<Report> getAllReports(Pageable pageable) {
        return  reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.PENDING, pageable);
    }

    // Resolve

    @Transactional
    public String resolve(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Report id must be a positive number");
        }

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ReportNotFoundException("Report with id: " + id + " not found"));

        if (report.getStatus() == ReportStatus.RESOLVED) {
            throw new InvalidReportStateException("Report " + id + " is already resolved");
        }
        report.setStatus(ReportStatus.RESOLVED);
        reportRepository.save(report);
        return report.getStatus().name(); // "RESOLVED"
    }
}
