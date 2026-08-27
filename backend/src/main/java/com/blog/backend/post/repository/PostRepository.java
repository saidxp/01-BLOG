package com.blog.backend.post.repository;

import com.blog.backend.post.model.Post;
import com.blog.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserOrderByCreatedAtDesc(User user);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}