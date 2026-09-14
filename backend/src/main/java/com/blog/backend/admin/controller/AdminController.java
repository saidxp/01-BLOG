package com.blog.backend.admin.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.admin.service.AdminService;
import com.blog.backend.report.dto.AdminReportDto;
import com.blog.backend.user.dto.AdminUserDto;
import com.blog.backend.user.dto.UserDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor

public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<Page<AdminUserDto>> getAllUsers(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    @PatchMapping("/{id}/ban")
    public ResponseEntity<AdminUserDto> banUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.banUser(id));
    }

    @PatchMapping("/{id}/unban")
    public ResponseEntity<AdminUserDto> unbanUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.unbanUser(id));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
    }

    // <<==>> \\ (<!!>)
    @GetMapping("/reports")
    public ResponseEntity<Page<AdminReportDto>> getAllReports(@PageableDefault(size = 20) Pageable pageable) {
        Page<AdminReportDto> reports = adminService.getAllReports(pageable);
        return ResponseEntity.ok(reports);
    }
}