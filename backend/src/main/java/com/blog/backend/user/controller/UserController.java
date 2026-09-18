package com.blog.backend.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.auth.security.CustomUserDetails;
 
import com.blog.backend.user.dto.UserProfileDto;
import com.blog.backend.user.dto.UserDto;
import com.blog.backend.user.model.User;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;
    private final UserService userService;
    // Just For Testing I Will Remove It Later (!!!) 
    // This Protected So It's will not hit This !!
    @GetMapping("/me")
    public UserDto getMyProfile(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        /// Just For Testintg This
        return userMapper.toDto(userDetails.getUser());
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<UserProfileDto> getPublicProfile(
            @PathVariable String username,
            Authentication authentication) {

        User currentUser = null;
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            currentUser = userDetails.getUser();
        }

        UserProfileDto dto = userService.getPublicProfile(username, currentUser);
        return ResponseEntity.ok(dto);
    }
}
