package com.blog.backend.subscription.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.subscription.dto.SubscriptionStatusDto;
import com.blog.backend.subscription.dto.SubscriptionUserDto;

import com.blog.backend.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{username}")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionStatusDto> subscribe(
            @PathVariable String username,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        SubscriptionStatusDto result = subscriptionService.subscribe(userDetails.getUser(), username);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    } 

    @DeleteMapping("/subscribe")
    public ResponseEntity<SubscriptionStatusDto> unsubscribe(
            @PathVariable String username,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        SubscriptionStatusDto result = subscriptionService.unsubscribe(userDetails.getUser(), username);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/subscribers")
    public ResponseEntity<List<SubscriptionUserDto>> getSubscribers(@PathVariable String username) {
        return ResponseEntity.ok(subscriptionService.getSubscribers(username));
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionUserDto>> getSubscriptions(@PathVariable String username) {
        return ResponseEntity.ok(subscriptionService.getSubscriptions(username));
    }
}