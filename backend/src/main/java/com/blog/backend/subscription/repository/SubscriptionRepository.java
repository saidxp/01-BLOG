package com.blog.backend.subscription.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.backend.subscription.model.Subscription;
import com.blog.backend.user.model.User;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);

    Optional<Subscription> findBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);

    List<Subscription> findBySubscribedTo(User subscribedTo);   // subscribers of a user

    List<Subscription> findBySubscriber(User subscriber);       // who this user subscribes to

    long countBySubscribedTo(User subscribedTo);                // subscriber count 

    long countBySubscriber(User subscriber);
}