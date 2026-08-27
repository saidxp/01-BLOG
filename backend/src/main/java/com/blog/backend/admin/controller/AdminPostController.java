package com.blog.backend.admin.controller;

import com.blog.backend.admin.service.AdminService;
import com.blog.backend.post.dto.PostDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final AdminService adminService;
    @GetMapping
    public Page<PostDto> getAllPosts(@PageableDefault(size = 20) Pageable pageable) {
        return adminService.getAllPosts(pageable);
    } 
}