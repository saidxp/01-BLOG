package com.blog.backend.user.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.user.dto.PublicUserDto;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;
    private final UserService userService;

    // This Protected So It's will not hit This !! 
    @GetMapping("/me")
    public UserDto getMyProfile(Authentication authentication) {
        CustomUserDetails userDetails
                = (CustomUserDetails) authentication.getPrincipal();
        return userMapper.toDto(userDetails.getUser());
    }

    @GetMapping("/users/{username}")
    public PublicUserDto getPublicProfile(@PathVariable String username, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userService.getPublicProfile(username, userDetails.getUser());
    }
    
}
