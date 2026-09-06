package com.blog.backend.media.service;

import com.blog.backend.media.model.MediaUpload;
import com.blog.backend.media.repository.MediaUploadRepository;
import com.blog.backend.post.storage.MediaStorageService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaCleanupJob {

    private static final Logger log = LoggerFactory.getLogger(MediaCleanupJob.class);

    private final MediaUploadRepository mediaUploadRepository;
    private final MediaStorageService mediaStorageService; 

    @Scheduled(cron = "0 0 3 * * *") // runs every day at 3:00 AM
    public void deleteOrphanedUploads() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        List<MediaUpload> orphaned = mediaUploadRepository.findByConfirmedFalseAndCreatedAtBefore(cutoff);

        if (orphaned.isEmpty()) {
            log.info("Media cleanup: no orphaned uploads found.");
            return;
        }

        for (MediaUpload upload : orphaned) {
            mediaStorageService.delete(upload.getUrl()); // assumes a delete method exists; see note below
        }

        mediaUploadRepository.deleteAll(orphaned);
        log.info("Media cleanup: deleted {} orphaned uploads.", orphaned.size());
    }
}