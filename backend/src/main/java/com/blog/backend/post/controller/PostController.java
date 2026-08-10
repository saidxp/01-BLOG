package com.blog.backend.post.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.post.dto.PostDeleteResponse;
import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.mapper.PostMapper;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.service.PostService;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import com.blog.backend.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostMapper postMapper;
    private final UserRepository userRepository;

    @PostMapping(value = "/api/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) MultipartFile media,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Post post = postService.createPost(userDetails.getUser(), description, media);
        PostDto dto = postMapper.toDto(post);              
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/api/posts/{id}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long id) {
        PostDto dto = postMapper.toDto(postService.getPostById(id));
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

    @PutMapping("/api/posts/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable Long id,
            @RequestParam("description") String description,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Post post = postService.updatePost(userDetails.getUser(), id, description);
        PostDto dto = postMapper.toDto(post);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/api/posts/{id}")
    public ResponseEntity<PostDeleteResponse> deletePost(@PathVariable Long id, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        PostDeleteResponse result = postService.deletePost(userDetails.getUser(), id);
        return ResponseEntity.ok(result);
    }
}