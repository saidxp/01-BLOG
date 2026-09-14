package com.blog.backend.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
 
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            System.out.println("===== STOMP CONNECT =====");

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            System.out.println("Authentication: " + authentication);

            if (authentication != null) {
                System.out.println("Authenticated: " + authentication.isAuthenticated());
                System.out.println("Username: " + authentication.getName());
            }

            if (authentication != null && authentication.isAuthenticated()) {
                accessor.setUser(authentication);

                System.out.println("WebSocket USER SET: " + authentication.getName());
            }
        }

        return message;
    }
}