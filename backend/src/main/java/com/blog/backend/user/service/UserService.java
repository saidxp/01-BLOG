package com.blog.backend.user.service;

import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.dto.UserProfileDto;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SubscriptionRepository subscriptionRepository;

    // <<==>> \\ (<!!>)
    public UserProfileDto getPublicProfile(String username, User currentUser) {
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        boolean isOwner = isOwner(currentUser, targetUser);
        boolean isSubscribed = isSubscribed(currentUser, targetUser, isOwner);
        return userMapper.toPublicDto(targetUser, isSubscribed, isOwner);
    }
    
    private boolean isOwner(User currentUser, User targetUser) {
        if (currentUser == null) {
            return false;
        }
            System.out.println("currentUser id: " + currentUser.getId() + ", targetUser id: " + targetUser.getId());
        return currentUser.getId().equals(targetUser.getId());
    }

    private boolean isSubscribed(User currentUser, User targetUser, boolean isOwner) {
        if (currentUser == null || isOwner) {
            return false;
        }
        return subscriptionRepository.existsBySubscriberAndSubscribedTo(currentUser, targetUser);
    } // <<==>> \\ <<==>> \\  
}