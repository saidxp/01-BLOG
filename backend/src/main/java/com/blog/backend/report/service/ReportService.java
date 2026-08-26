package com.blog.backend.report.service;

import com.blog.backend.exception.PostNotFoundException;
import com.blog.backend.exception.SelfReportException;
import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
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
        User reportedUser = userRepository.findByUsername(reportedUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + reportedUsername));

        if (reporter.getId().equals(reportedUser.getId())) {
            throw new SelfReportException("You cannot report yourself");
        }

        Report.ReportBuilder builder = Report.builder()
                .reporter(reporter)
                .reportedUser(reportedUser)
                .reason(reason);

        if (postId != null) {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
            builder.post(post);
        }

        reportRepository.save(builder.build());
    }
    
    public Page<Report> getAllReports(Pageable pageable) {
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}