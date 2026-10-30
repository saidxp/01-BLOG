package com.blog.backend.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service; 
import com.blog.backend.notification.dto.NotificationDto;


@Service
@RequiredArgsConstructor
public class NotificationWebSocketPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendTestMessage(String username, NotificationDto Notification) {
        messagingTemplate.convertAndSendToUser(
            username,
            "/queue/notifications",
            Notification
        );
    }
}
