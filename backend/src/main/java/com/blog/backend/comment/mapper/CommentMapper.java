package com.blog.backend.comment.mapper;

import com.blog.backend.comment.dto.CommentDto;
import com.blog.backend.comment.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    public CommentDto toDto(Comment comment, Long currentUserId) { 
        boolean isCommentAuthor = currentUserId != null && comment.getUser().getId().equals(currentUserId);
        boolean isPostOwner = currentUserId != null && comment.getPost().getUser().getId().equals(currentUserId);
        boolean canDelete = isCommentAuthor || isPostOwner;
        return new CommentDto(
                comment.getId(),
                comment.getUser().getUsername(),
                comment.getContent(),
                comment.getCreatedAt(),
                canDelete);
    } // <<==>> \\ (o) // <<==>> \\ 
}