package com.blog.backend.post.service;

import com.blog.backend.exception.NotPostOwnerException;
import com.blog.backend.exception.PostNotFoundException;
import com.blog.backend.notification.service.NotificationService;
import com.blog.backend.post.dto.PostDeleteResponse;
import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.enums.MediaType;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.post.storage.MediaStorageService;
import com.blog.backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.blog.backend.user.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MediaStorageService mediaStorageService;
    private final Validator validator;
    private final NotificationService notificationService;

    @Transactional
    public Post createPost(User owner, String title, String content, MultipartFile mediaFile) {
        Post.PostBuilder postBuilder = Post.builder()
                .user(owner)
                .title(title)
                .content(content);

        if (mediaFile != null && !mediaFile.isEmpty()) {
            MediaType mediaType = validator.validateAndDetectType(mediaFile);
            String mediaUrl = mediaStorageService.store(mediaFile);
            postBuilder.mediaUrl(mediaUrl).mediaType(mediaType);
        }

        Post savedPost = postRepository.save(postBuilder.build());
        notificationService.notifySubscribersOfNewPost(savedPost);
        return savedPost;
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
    }

    // Fetch All Posts BY USER <!!!!>
    public List<Post> getPostsByUser(User user) {
        return postRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Fetch All Posts with Pagination
    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    // <<>> delete and update

    @Transactional
    public Post updatePost(User currentUser, Long postId, String newDescription) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new NotPostOwnerException("You are not allowed to edit this post");
        }
        // << I Will Handle It Later This Update Content 
        //post.setDescription(newDescription);
        return postRepository.save(post);
    }

    @Transactional
    public PostDeleteResponse deletePost(User currentUser, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        boolean isOwner = post.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new NotPostOwnerException("You are not allowed to delete this post");
        }

        if (post.getMediaUrl() != null) {
            mediaStorageService.delete(post.getMediaUrl());
        }

        postRepository.delete(post);

        return new PostDeleteResponse(true, postId, "Post deleted successfully");
    }

}