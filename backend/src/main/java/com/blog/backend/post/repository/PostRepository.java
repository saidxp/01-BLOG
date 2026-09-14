package com.blog.backend.post.repository;

import com.blog.backend.post.model.Post;
import com.blog.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable page);
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}