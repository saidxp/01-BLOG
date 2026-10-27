package com.blog.backend.admin.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.List;

import com.blog.backend.admin.dto.AdminStatsDto;
import com.blog.backend.comment.repository.CommentRepository;
import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.likes.repository.LikeRepository;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.report.enums.ReportStatus;
import com.blog.backend.report.repository.ReportRepository;
import com.blog.backend.user.dto.AdminUserDto;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.enums.UserStatus;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import com.blog.backend.post.dto.*;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;

    public Page<AdminUserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map((user) -> userMapper.toAdminUserDto(user));
    }

    public UserDto getUserById(Long id) {
        User user = findUserOrThrow(id);
        return userMapper.toDto(user);
    }

    @Transactional
    public AdminUserDto banUser(Long id) {
        User user = findUserOrThrow(id);
        user.setStatus(UserStatus.BANNED);
        return userMapper.toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto unbanUser(Long id) {
        User user = findUserOrThrow(id);
        user.setStatus(UserStatus.ACTIVE);
        return userMapper.toAdminUserDto(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public Page<AdminPostDto> getAllPosts(Pageable pageable) {
        Page<AdminPostDto> posts = postRepository.findAll(pageable)
                .map(post -> new AdminPostDto(
                        post.getId(),
                        post.getTitle(),
                        post.getUser().getUsername(),
                        post.getCreatedAt()));
        return posts;
    }

    /** Simple system overview for the admin dashboard. */
    public AdminStatsDto getStats() {
        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);

        AdminStatsDto.TopUser mostReportedUser = reportRepository
                .findTopReportedUsers(PageRequest.of(0, 1)).stream()
                .findFirst()
                .map(row -> new AdminStatsDto.TopUser(
                        ((User) row[0]).getUsername(),
                        ((Number) row[1]).longValue()))
                .orElse(null);

        AdminStatsDto.TopPost mostLikedPost =
                topPostById(likeRepository.findTopLikedPostIds(PageRequest.of(0, 1)));
        AdminStatsDto.TopPost mostCommentedPost =
                topPostById(commentRepository.findTopCommentedPostIds(PageRequest.of(0, 1)));

        return new AdminStatsDto(totalUsers, totalPosts, pendingReports,
                mostReportedUser, mostLikedPost, mostCommentedPost);
    }

    private AdminStatsDto.TopPost topPostById(List<Object[]> rows) {
        return rows.stream().findFirst().map(row -> {
            Long postId = ((Number) row[0]).longValue();
            long count = ((Number) row[1]).longValue();
            String title = postRepository.findById(postId).map(Post::getTitle).orElse("(deleted post)");
            return new AdminStatsDto.TopPost(postId, title, count);
        }).orElse(null);
    }
}