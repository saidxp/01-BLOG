package com.blog.backend.comment.controller;

import com.blog.backend.auth.security.CustomUserDetails;
import com.blog.backend.comment.dto.CommentDto;
import com.blog.backend.comment.mapper.CommentMapper;
import com.blog.backend.comment.model.Comment;
import com.blog.backend.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;

    @PostMapping
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long postId,
            @RequestParam("content") String content,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Comment comment = commentService.addComment(userDetails.getUser(), postId, content);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentMapper.toDto(comment));
    }

    @GetMapping
    public ResponseEntity<Page<CommentDto>> getComments(
            @PathVariable Long postId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<CommentDto> comments = commentService.getComments(postId, pageable).map(commentMapper::toDto);
        return ResponseEntity.ok(comments);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        commentService.deleteComment(userDetails.getUser(), commentId);
        return ResponseEntity.noContent().build();
    }
}