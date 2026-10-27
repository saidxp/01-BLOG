package com.blog.backend.report.repository;

import com.blog.backend.report.enums.ReportStatus;
import com.blog.backend.report.model.Report;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Report>  findByStatusOrderByCreatedAtDesc(ReportStatus re, Pageable r);

    long countByStatus(ReportStatus status);

    // [reportedUser, reportCount] ordered most-reported first (use Pageable to take the top N)
    @Query("SELECT r.reportedUser, COUNT(r) FROM Report r WHERE r.reportedUser IS NOT NULL "
            + "GROUP BY r.reportedUser ORDER BY COUNT(r) DESC")
    List<Object[]> findTopReportedUsers(Pageable pageable);
}