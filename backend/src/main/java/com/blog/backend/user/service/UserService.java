package com.blog.backend.user.service;

import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.dto.PublicUserDto;
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

    public PublicUserDto getPublicProfile(String username, User currentUser) {
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        long subscriberCount = subscriptionRepository.countBySubscribedTo(targetUser);
        long subscriptionCount = subscriptionRepository.countBySubscriber(targetUser);

        boolean isSubscribed = currentUser != null
                && subscriptionRepository.existsBySubscriberAndSubscribedTo(currentUser, targetUser);

        return userMapper.toPublicDto(targetUser, subscriberCount, subscriptionCount, isSubscribed);
    }
}