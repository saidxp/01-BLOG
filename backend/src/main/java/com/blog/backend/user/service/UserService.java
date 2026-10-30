package com.blog.backend.user.service;

import com.blog.backend.post.service.Validator;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.comment.repository.CommentRepository;
import com.blog.backend.post.enums.MediaType;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.dto.UserProfileDto;
import com.blog.backend.user.dto.UserSearchResultDto;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.blog.backend.storage.MediaStorageService;
import com.blog.backend.exception.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SubscriptionRepository subscriptionRepository;
    private final MediaStorageService mediaStorageService;
    private final Validator validator;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    // <<==>> \\ (<!!>)
    public UserProfileDto getPublicProfile(String username, User currentUser) {
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        boolean isOwner = isOwner(currentUser, targetUser);
        boolean isSubscribed = isSubscribed(currentUser, targetUser, isOwner);
        long postsCount = postRepository.countByUser(targetUser);
        long commentsReceivedCount = commentRepository.countByPostOwner(targetUser);
        return userMapper.toPublicDto(
                targetUser,
                isSubscribed,
                isOwner,
                postsCount,
                commentsReceivedCount);
    }

    private boolean isOwner(User currentUser, User targetUser) {
        if (currentUser == null) {
            return false;
        }
        return currentUser.getId().equals(targetUser.getId());
    }

    // <<==>> \\ {<!!>}
    private boolean isSubscribed(User currentUser, User targetUser, boolean isOwner) {
        if (currentUser == null || isOwner) {
            return false;
        }
        return subscriptionRepository.existsBySubscriberAndSubscribedTo(currentUser, targetUser);
    }

    // <<==>> (UPDATE) <<==>> (THIS) <<==>> (PROFILE) \\ {(0101011010101010)} \\

    public UserProfileDto updateProfile(User currentUser, String bio, MultipartFile avatar) {

        if (bio != null && bio.length() > 300) {
            throw new IllegalArgumentException("Bio cannot exceed 300 characters");
        }

        if (avatar != null && !avatar.isEmpty()) {
            // <<==>> \\
            MediaType mediaType = validator.validateAndDetectType(avatar);

            if (mediaType != MediaType.IMAGE) {
                throw new InvalidMediaTypeException(
                        "Please provide a valid image");
            }
            // <<==>>
            String oldAvatarUrl = currentUser.getAvatarUrl();

            // <<==>>
            String avatarUrl = mediaStorageService.store(avatar);

            currentUser.setAvatarUrl(avatarUrl);

            User saved = userRepository.save(currentUser);
            if (oldAvatarUrl != null) {
                mediaStorageService.delete(oldAvatarUrl);
            }
            // <=> \\ {<!>}. {<!>} \\ {}
            currentUser = saved;
        }

        currentUser.setBio(bio);
        currentUser = userRepository.save(currentUser);

        return getPublicProfile(
                currentUser.getUsername(),
                currentUser);
    }

    /// Search On Users !!
    public List<UserSearchResultDto> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return userRepository.findByUsernameContainingIgnoreCase(query.trim())
                .stream()
                .map(userMapper::toSearchResultDto)
                .toList();
    }
    // <<==>>>>>>>>.. \\ {<!>} {!!}
}
