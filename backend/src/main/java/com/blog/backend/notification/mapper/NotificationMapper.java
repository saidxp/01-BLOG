package com.blog.backend.notification.mapper;

import com.blog.backend.notification.dto.NotificationDto;
import com.blog.backend.notification.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    public NotificationDto toDto(Notification n) {
        return new NotificationDto(n.getId(), n.getMessage(), n.getPost().getId(), n.isRead(), n.getCreatedAt());
    }
}