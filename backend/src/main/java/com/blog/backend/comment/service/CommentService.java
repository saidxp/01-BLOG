package com.blog.backend.comment.service;

import com.blog.backend.comment.model.Comment;
import com.blog.backend.comment.repository.CommentRepository;
import com.blog.backend.exception.CommentNotFoundException;
import com.blog.backend.exception.NotCommentOwnerException;
import com.blog.backend.exception.PostNotFoundException;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.user.enums.Role;
import com.blog.backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public Comment addComment(User currentUser, Long postId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        Comment comment = Comment.builder()
                .user(currentUser)
                .post(post)
                .content(content)
                .build();
        return commentRepository.save(comment);
    }

    public Page<Comment> getComments(Long postId, Pageable pageable) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        return commentRepository.findByPostOrderByCreatedAtDesc(post, pageable);
    }

    @Transactional
    public void deleteComment(User currentUser, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + commentId));

        boolean isOwner = comment.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new NotCommentOwnerException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }
}