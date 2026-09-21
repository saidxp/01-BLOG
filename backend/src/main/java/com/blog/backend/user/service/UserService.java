package com.blog.backend.user.service;

import com.blog.backend.post.service.Validator;
import com.blog.backend.post.enums.MediaType;
import com.blog.backend.subscription.repository.SubscriptionRepository;
import com.blog.backend.user.dto.UserProfileDto;
import com.blog.backend.user.mapper.UserMapper;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.blog.backend.storage.MediaStorageService;
import com.blog.backend.exception.*;;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SubscriptionRepository subscriptionRepository;
    private final MediaStorageService mediaStorageService;
    private final Validator validator;

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

    // <<==>> \\ {<!!>}
    private boolean isSubscribed(User currentUser, User targetUser, boolean isOwner) {
        if (currentUser == null || isOwner) {
            return false;
        }
        return subscriptionRepository.existsBySubscriberAndSubscribedTo(currentUser, targetUser);
    }

    // <<==>> (UPDATE) <<==>> (THIS) <<==>> (PROFILE) \\  {(0101011010101010)} // {<!!>}
    public UserProfileDto updateProfile(User currentUser, String bio, MultipartFile avatar) { 
        // <<==>> \\ {<!!>}  
        if (avatar != null && !avatar.isEmpty()) {
            if (currentUser.getAvatarUrl() != null) {
                mediaStorageService.delete(currentUser.getAvatarUrl());
            } 

            // <<===>> {} \\ 
            MediaType mediaType = validator.validateAndDetectType(avatar);
            if (mediaType != MediaType.IMAGE) {
                throw new InvalidMediaTypeException("Please Provide In Valid Image");
            } 
            // <<==>> \\ {(|<->|)}
            // <<==>> \\ {(|<->|)} // {(|<->|)}
            String avatarUrl = mediaStorageService.store(avatar);
            currentUser.setAvatarUrl(avatarUrl); // 
        } // <<==>> \\ {<!<->!>} 
        currentUser.setBio(bio);  // {<=>} \\ {<!-!>}
        User saved = userRepository.save(currentUser);
        return getPublicProfile(saved.getUsername(), currentUser); 
    } 
    // <<==>> \\
}