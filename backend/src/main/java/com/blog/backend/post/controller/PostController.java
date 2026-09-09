package com.blog.backend.post.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.post.dto.PostDeleteResponse;
import com.blog.backend.post.dto.PostDetailDto;
import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.dto.PostId;
import com.blog.backend.post.mapper.PostMapper;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.service.PostService;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import com.blog.backend.exception.UserNotFoundException;
import com.blog.backend.likes.repository.LikeRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostMapper postMapper;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    @PostMapping(value = "/api/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostId> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile media,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Post post = postService.createPost(userDetails.getUser(), title, content, media);
        PostId dto = postMapper.reDto(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // Get Posts // <<==>> \\ (!!)
    @GetMapping("/api/posts")
    public ResponseEntity<List<PostDto>> getAllPosts(Pageable pageable) {
        List<PostDto> posts = postService.getAllPosts(pageable)
                .stream()
                .map(postMapper::toDto)
                .toList();
        return ResponseEntity.ok(posts);
    }

    // <<==>> \\ (<!!>)

    @GetMapping("/api/posts/{id}")
    public ResponseEntity<PostDetailDto> getPost(
            @PathVariable Long id,
            Authentication authentication) {
        Post post = postService.getPostById(id);
        Long currentUserId = null;
        User currentUser = null;

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            currentUserId = userDetails.getUser().getId();
            currentUser = userDetails.getUser();
        }

        boolean liked = currentUser != null && likeRepository.existsByUserAndPost(currentUser, post);
        long likeCount = likeRepository.countByPost(post);

        PostDetailDto dto = postMapper.toDetailDto(post, currentUserId, liked, likeCount);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/api/users/{username}/posts")
    public ResponseEntity<List<PostDto>> getUserPosts(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        List<PostDto> posts = postService.getPostsByUser(user)
                .stream()
                .map(postMapper::toDto)
                .toList();

        return ResponseEntity.ok(posts);
    }

    // THIS WILL BE CHANGE LATER AT UPDATE (!!)

    @PutMapping(value = "/api/posts/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostId> updatePost(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile media,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Post post = postService.updatePost(userDetails.getUser(), id, title, content, media);
        PostId dto = postMapper.reDto(post);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/api/posts/{id}")
    public ResponseEntity<PostDeleteResponse> deletePost(@PathVariable Long id, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        PostDeleteResponse result = postService.deletePost(userDetails.getUser(), id);
        return ResponseEntity.ok(result);
    }
}