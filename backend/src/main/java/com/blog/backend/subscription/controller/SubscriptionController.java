package com.blog.backend.subscription.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.subscription.dto.SubscriptionUserDto;
import com.blog.backend.subscription.service.SubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{username}")
@RequiredArgsConstructor

public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public void subscribe(@PathVariable String username, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        subscriptionService.subscribe(userDetails.getUser(), username);
    }

    @DeleteMapping("/subscribe")
    public void unsubscribe(@PathVariable String username, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        subscriptionService.unsubscribe(userDetails.getUser(), username);
    }
    
    @GetMapping("/subscribers")
    public List<SubscriptionUserDto> getSubscribers(@PathVariable String username) {
        return subscriptionService.getSubscribers(username);
    }

    @GetMapping("/subscriptions")
    public List<SubscriptionUserDto> getSubscriptions(@PathVariable String username) {
        return subscriptionService.getSubscriptions(username);
    }

}