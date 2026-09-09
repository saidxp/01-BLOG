package com.blog.backend.likes.service;

import com.blog.backend.exception.AlreadyLikedException;
import com.blog.backend.exception.NotLikedException;
import com.blog.backend.exception.PostNotFoundException;   
import com.blog.backend.likes.dto.LikeStatusDto;
import com.blog.backend.likes.model.Like;
import com.blog.backend.likes.repository.LikeRepository;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.repository.PostRepository;
import com.blog.backend.user.model.User; 
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    @Transactional
    public LikeStatusDto likePost(User currentUser, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (likeRepository.existsByUserAndPost(currentUser, post)) {
            throw new AlreadyLikedException("You already liked this post");
        }
        
        Like like = Like.builder()
                .user(currentUser)
                .post(post)
                .build();
        likeRepository.save(like);

        long count = likeRepository.countByPost(post);
        return new LikeStatusDto(true, count);
    }

    @Transactional
    public LikeStatusDto unlikePost(User currentUser, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        Like like = likeRepository.findByUserAndPost(currentUser, post)
                .orElseThrow(() -> new NotLikedException("You have not liked this post"));

        likeRepository.delete(like);

        long count = likeRepository.countByPost(post);
        return new LikeStatusDto(false, count);
    }
}