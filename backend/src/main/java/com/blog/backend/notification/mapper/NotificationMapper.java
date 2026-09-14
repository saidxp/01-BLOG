package com.blog.backend.notification.mapper;

import com.blog.backend.notification.dto.NotificationDto;
import com.blog.backend.notification.model.Notification;
import org.springframework.stereotype.Component;
import com.blog.backend.user.model.User;

@Component
public class NotificationMapper {
    public NotificationDto toDto(Notification notification) {
    User author = notification.getPost().getUser();
    return new NotificationDto(
        notification.getId(),
        notification.getMessage(),
        notification.getPost().getId(),
        author.getUsername(),
        author.getAvatarUrl(),
        notification.isRead(),
        notification.getCreatedAt()
    );
}
}


