package com.blog.backend.admin.dto;

/**
 * Lightweight system overview for the admin dashboard.
 * Top-item fields are null when there is no data yet (e.g. fresh/empty database).
 */
public record AdminStatsDto(
        long totalUsers,
        long totalPosts,
        long pendingReports,
        TopUser mostReportedUser,
        TopPost mostLikedPost,
        TopPost mostCommentedPost
) {
    public record TopUser(String username, long count) {}

    public record TopPost(Long id, String title, long count) {}
}
