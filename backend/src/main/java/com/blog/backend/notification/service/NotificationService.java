 package com.blog.backend.notification.service;

import com.blog.backend.exception.NotificationNotFoundException;
import com.blog.backend.notification.model.Notification;
import com.blog.backend.notification.repository.NotificationRepository;
import com.blog.backend.post.model.Post;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public void notifySubscribersOfNewPost(Post post) {
        User author = post.getUser();

        subscriptionRepository.findBySubscribedTo(author).forEach(subscription -> {
            Notification notification = Notification.builder()
                    .recipient(subscription.getSubscriber())
                    .post(post)
                    .message(author.getUsername() + " published a new post")
                    .build();
            notificationRepository.save(notification);
        });
    }

    public Page<Notification> getMyNotifications(User currentUser, Pageable pageable) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(currentUser, pageable);
    }

    public long getUnreadCount(User currentUser) {
        return notificationRepository.countByRecipientAndReadFalse(currentUser);
    }

    @Transactional
    public void markAsRead(User currentUser, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new NotificationNotFoundException("Notification not found with id: " + notificationId);
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}