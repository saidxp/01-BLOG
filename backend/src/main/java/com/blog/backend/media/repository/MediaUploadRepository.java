package com.blog.backend.media.repository;

import com.blog.backend.post.model.Post;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.backend.media.model.MediaUpload;

public interface MediaUploadRepository extends JpaRepository<MediaUpload, Long> {

    List<MediaUpload> findByUrlIn(List<String> urls);
    List<MediaUpload> findByConfirmedFalseAndCreatedAtBefore(LocalDateTime cutoff); // <<==>> \\ (<!<->!>)
    List<MediaUpload> findByPost(Post post);
}