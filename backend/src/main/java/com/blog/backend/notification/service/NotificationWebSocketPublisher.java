package com.blog.backend.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationWebSocketPublisher {

     private final SimpMessagingTemplate messagingTemplate;

    public void sendTestMessage(String username) {

        System.out.println("===== WS PUBLISHER =====");
        System.out.println("Sending to username: " + username);

        messagingTemplate.convertAndSendToUser(
            username,
            "/queue/notifications",
            Map.of(
                "message",
                "Test message: WebSocket connected successfully!"
            )
        );

        System.out.println("===== WS MESSAGE SENT TO BROKER =====");
    }
}
