package com.blog.backend.likes.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.likes.dto.LikeStatusDto;
import com.blog.backend.likes.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<LikeStatusDto> like(@PathVariable Long postId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        LikeStatusDto result = likeService.likePost(userDetails.getUser(), postId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @DeleteMapping
    public ResponseEntity<LikeStatusDto> unlike(@PathVariable Long postId, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        LikeStatusDto result = likeService.unlikePost(userDetails.getUser(), postId);
        return ResponseEntity.ok(result);
    }
}
