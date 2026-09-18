package com.blog.backend.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
 
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.security.Principal;

@Component
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            System.out.println("===== STOMP CONNECT =====");
            Principal user = accessor.getUser();
            System.out.println("WebSocket USER: " + user);
            if (user != null) {
                System.out.println("Username: " + user.getName());
            }
        }
        return message;
    }
}