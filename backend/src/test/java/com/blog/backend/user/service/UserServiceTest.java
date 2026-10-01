package com.blog.backend.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.blog.backend.comment.repository.CommentRepository;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.post.service.Validator;
import com.blog.backend.storage.MediaStorageService;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.dto.UserProfileDto;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
    private final MediaStorageService mediaStorageService = mock(MediaStorageService.class);
    private final Validator validator = mock(Validator.class);
    private final PostRepository postRepository = mock(PostRepository.class);
    private final CommentRepository commentRepository = mock(CommentRepository.class);

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(
                userRepository,
                new UserMapper(),
                subscriptionRepository,
                mediaStorageService,
                validator,
                postRepository,
                commentRepository);
    }

    @Test
    void publicProfileIncludesExactPostAndReceivedCommentCounts() {
        User profileOwner = User.builder()
                .id(7L)
                .username("author")
                .createdAt(LocalDateTime.of(2026, 9, 1, 12, 0))
                .build();

        when(userRepository.findByUsername("author")).thenReturn(Optional.of(profileOwner));
        when(postRepository.countByUser(profileOwner)).thenReturn(4L);
        when(commentRepository.countByPostOwner(profileOwner)).thenReturn(11L);

        UserProfileDto profile = userService.getPublicProfile("author", null);

        assertEquals(7L, profile.getId());
        assertEquals(4L, profile.getPostsCount());
        assertEquals(11L, profile.getCommentsReceivedCount());
    }
}
