package com.blog.backend.subscription.dto;

import java.time.LocalDateTime;

public record SubscriptionUserDto(String username, LocalDateTime subscribedSince) {
}
 