package com.blog.backend.user.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;

    @GetMapping("/me")
    public UserDto getMyProfile(Authentication authentication) {
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        return userMapper.toDto(userDetails.getUser());
    }
     
}