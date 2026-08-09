package com.blog.backend.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.enums.UserStatus;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto getUserById(Long id) {
        User user = findUserOrThrow(id);
        return userMapper.toDto(user);
    }

    @Transactional
    public UserDto banUser(Long id) {
        User user = findUserOrThrow(id);
        user.setStatus(UserStatus.BANNED);
        return userMapper.toDto(user);
    }

    @Transactional
    public UserDto unbanUser(Long id) {
        User user = findUserOrThrow(id);
        user.setStatus(UserStatus.ACTIVE);
        return userMapper.toDto(user);
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
}