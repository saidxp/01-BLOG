package com.blog.backend.subscription.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.backend.exception.AlreadySubscribedException;
import com.blog.backend.exception.NotSubscribedException;
import com.blog.backend.exception.SelfSubscriptionException;
import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.subscription.model.Subscription;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import com.blog.backend.subscription.dto.SubscriptionStatusDto;
import com.blog.backend.subscription.dto.SubscriptionUserDto;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Transactional
    public SubscriptionStatusDto subscribe(User currentUser, String targetUsername) {
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + targetUsername));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new SelfSubscriptionException("You cannot subscribe to yourself");
        }

        if (subscriptionRepository.existsBySubscriberAndSubscribedTo(currentUser, targetUser)) {
            throw new AlreadySubscribedException("Already subscribed to this user");
        }

        Subscription subscription = Subscription.builder()
                .subscriber(currentUser)
                .subscribedTo(targetUser)
                .build();

        subscriptionRepository.save(subscription);

        long subscriberCount = subscriptionRepository.countBySubscribedTo(targetUser);
        return new SubscriptionStatusDto(true, subscriberCount);
    }

    @Transactional
    public SubscriptionStatusDto unsubscribe(User currentUser, String targetUsername) {
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + targetUsername));

        Subscription subscription = subscriptionRepository
                .findBySubscriberAndSubscribedTo(currentUser, targetUser)
                .orElseThrow(() -> new NotSubscribedException("You are not subscribed to this user"));

        subscriptionRepository.delete(subscription);

        long subscriberCount = subscriptionRepository.countBySubscribedTo(targetUser);
        return new SubscriptionStatusDto(false, subscriberCount);
    }

    public List<SubscriptionUserDto> getSubscribers(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        return subscriptionRepository.findBySubscribedTo(user)
                .stream()
                .map(sub -> new SubscriptionUserDto(
                        sub.getSubscriber().getUsername(),
                        sub.getCreatedAt()
                ))
                .toList();
    }

    public List<SubscriptionUserDto> getSubscriptions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        return subscriptionRepository.findBySubscriber(user)
                .stream()
                .map(sub -> new SubscriptionUserDto(
                        sub.getSubscribedTo().getUsername(),
                        sub.getCreatedAt()
                ))
                .toList();
    }
}