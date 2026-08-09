package com.blog.backend.admin.controller;


import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.admin.service.AdminService;
import com.blog.backend.user.dto.UserDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor

public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public List<UserDto> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        return adminService.getUserById(id);
    }

    @PatchMapping("/{id}/ban")
    public UserDto banUser(@PathVariable Long id) {
        return adminService.banUser(id);
    }

    @PatchMapping("/{id}/unban")
    public UserDto unbanUser(@PathVariable Long id) {
        return adminService.unbanUser(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
    }

}