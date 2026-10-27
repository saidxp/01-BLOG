package com.blog.backend.admin.controller;

import com.blog.backend.admin.service.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.blog.backend.post.dto.AdminPostDto;
import org.springframework.web.bind.annotation.GetMapping; 

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<Page<AdminPostDto>> getAllPosts(@PageableDefault(size = 20) Pageable pageable) {
        Page<AdminPostDto> posts = adminService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }
    
}