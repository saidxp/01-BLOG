package com.blog.backend.likes.repository;


import com.blog.backend.likes.model.Like;
import com.blog.backend.post.model.Post;
import com.blog.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndPost(User user, Post post);
    Optional<Like> findByUserAndPost(User user, Post post);
    long countByPost(Post post);
}