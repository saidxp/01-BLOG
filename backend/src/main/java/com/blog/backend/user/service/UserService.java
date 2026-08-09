package com.blog.backend.user.service;

import org.springframework.stereotype.Service;

import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.user.dto.PublicUserDto;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public PublicUserDto getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        return userMapper.toPublicDto(user);
    } 
}