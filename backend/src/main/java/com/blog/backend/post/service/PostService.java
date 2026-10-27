package com.blog.backend.post.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.blog.backend.comment.repository.CommentRepository;
import com.blog.backend.exception.InvalidMediaTypeException;
import com.blog.backend.exception.NotPostOwnerException;
import com.blog.backend.exception.PostNotFoundException;
import com.blog.backend.likes.repository.LikeRepository;
import com.blog.backend.media.model.MediaUpload;
import com.blog.backend.media.repository.MediaUploadRepository;
import com.blog.backend.media.service.MediaUploadService;
import com.blog.backend.notification.service.NotificationService;
import com.blog.backend.post.dto.PostDeleteResponse;
import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.enums.MediaType;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.storage.MediaStorageService;
import com.blog.backend.user.enums.Role;
import com.blog.backend.user.model.User;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import com.blog.backend.post.mapper.PostMapper;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MediaStorageService mediaStorageService;
    private final Validator validator;
    private final NotificationService notificationService;
    private final MediaUploadService mediaUploadService;
    private final MediaUploadRepository mediaUploadRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final PostMapper postMapper;

    @Transactional
    public Post createPost(User owner, String title, String content, MultipartFile mediaFile) {
        Post.PostBuilder postBuilder = Post.builder()
                .user(owner)
                .title(title)
                .content(content);


        // Protected against invalid title and content
        if (title == null || title.isBlank() || title.length() > 200) {
            throw new IllegalArgumentException("Invalid title");
        }

        if (content == null || content.isBlank() || content.length() > 50_000) {
            throw new IllegalArgumentException("Invalid content");
        }
        
        // <<==>> \\ {<<!!>>}
        if (mediaFile != null && !mediaFile.isEmpty()) {
            MediaType mediaType = validator.validateAndDetectType(mediaFile);

            if (mediaType != MediaType.IMAGE) {
                throw new InvalidMediaTypeException("Cover media must be an image.");
            }

            String mediaUrl = mediaStorageService.store(mediaFile);
            postBuilder.mediaUrl(mediaUrl).mediaType(mediaType);
        }
        Post savedPost = postRepository.save(postBuilder.build());
        //// <<<===>>> \\\\
        mediaUploadService.confirmUploadsUsedIn(savedPost, content);
        // I Need To Get All This Url And Based on Them i Put to Them In Post Id
        notificationService.notifySubscribersOfNewPost(savedPost); // <<==>> \\ (<!!>)
        return savedPost;
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
    }

    // Fetch All Posts BY USER <!!!!>
    public Page<PostDto> getPostsByUser(User user, Pageable pageable) {
        Page<Post> posts = postRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return this.optimizedQuery(posts);
    }

    // Fetch All Posts with Pagination NOT OPTIMIZEED (!!!)
    public Page<PostDto> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return this.optimizedQuery(posts);

    }

    // << GET POSTS BY SUBSCRIP TO >> \\
    public Page<PostDto> getPostBysubscribeTo(
            String username,
            Pageable pageable) {
        Page<Post> posts = postRepository.findPostsFromSubscribedUsers(username, pageable);
        return optimizedQuery(posts);
    }

    private Page<PostDto> optimizedQuery(Page<Post> posts) {
        List<Long> postIds = posts.getContent()
                .stream()
                .map(Post::getId)
                .toList();
        List<Object[]> likes = likeRepository.countLikesByPostIds(postIds);
        List<Object[]> comments = commentRepository.countCommentsByPostIds(postIds);
        Map<Long, Long> likesCount = likes.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]));
        Map<Long, Long> commentsCount = comments.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]));
        return posts.map(post -> postMapper.toDto(
                post,
                likesCount.getOrDefault(post.getId(), 0L),
                commentsCount.getOrDefault(post.getId(), 0L)));
    }

    // <<>> delete And Update (!!)
    @Transactional
    public Post updatePost(User currentUser, Long postId, String newTitle, String newContent, MultipartFile mediaFile) {
         // Protected against invalid title and content
        if (newTitle == null ||     newTitle.isBlank() ||newTitle.length() > 200) {
            throw new IllegalArgumentException("Invalid title");
        }

        if (newContent == null || newContent.isBlank() || newContent.length() > 50_000) {
            throw new IllegalArgumentException("Invalid content");
        }
        
        // <<==>> \\ {<<!!>>}
       
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new NotPostOwnerException("You are not allowed to edit this post");
        }
         if (mediaFile != null && !mediaFile.isEmpty()) {
            if (post.getMediaUrl() != null) {
                mediaStorageService.delete(post.getMediaUrl());
            }
            MediaType mediaType = validator.validateAndDetectType(mediaFile);

            if (mediaType != MediaType.IMAGE) {
                throw new InvalidMediaTypeException("Cover media must be an image.");
            }

            String mediaUrl = mediaStorageService.store(mediaFile);
            post.setMediaUrl(mediaUrl);
            post.setMediaType(mediaType);
        }
        post.setTitle(newTitle);
        post.setContent(newContent);
        Post updatedPost = postRepository.save(post);
        mediaUploadService.confirmUploadsUsedIn(updatedPost, newContent);
        return updatedPost;
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

        List<MediaUpload> attachedMedia = mediaUploadRepository.findByPost(post);
        for (MediaUpload media : attachedMedia) {
            mediaStorageService.delete(media.getUrl());
        }
        mediaUploadRepository.deleteAll(attachedMedia);

        if (post.getMediaUrl() != null) {
            mediaStorageService.delete(post.getMediaUrl());
        }

        postRepository.delete(post);

        return new PostDeleteResponse(true, postId, "Post deleted successfully");
    }

    //
}
