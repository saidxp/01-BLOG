package com.blog.backend.admin.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.post.repository.PostRepository;
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
}