package com.blog.backend.media.repository;

import com.blog.backend.media.model.MediaUpload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MediaUploadRepository extends JpaRepository<MediaUpload, Long> {

    List<MediaUpload> findByUrlIn(List<String> urls);
    List<MediaUpload> findByConfirmedFalseAndCreatedAtBefore(LocalDateTime cutoff); // <<==>> \\ (<!<->!>)
}