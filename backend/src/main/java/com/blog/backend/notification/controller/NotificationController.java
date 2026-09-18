package com.blog.backend.notification.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.notification.dto.NotificationDto;
import com.blog.backend.notification.mapper.NotificationMapper;
import com.blog.backend.notification.service.NotificationService;
 

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    @GetMapping
    public ResponseEntity<Page<NotificationDto>> getMyNotifications(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Page<NotificationDto> result = notificationService
                .getMyNotifications(userDetails.getUser(), pageable)
                .map(notificationMapper::toDto); // <<==>> \\ {}
        return ResponseEntity.ok(result); // <<==>> \\ {<!!>} 
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(notificationService.getUnreadCount(userDetails.getUser()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        notificationService.markAsRead(userDetails.getUser(), id);
        return ResponseEntity.noContent().build();
    }
}