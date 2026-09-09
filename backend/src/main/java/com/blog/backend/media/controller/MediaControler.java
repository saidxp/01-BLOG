package com.blog.backend.media.controller;

import com.blog.backend.media.service.MediaUploadService;
import com.blog.backend.auth.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RequiredArgsConstructor
@RestController
public class MediaControler {

    private final MediaUploadService mediaUploadService;
    @PostMapping(value = "/api/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String url = mediaUploadService.uploadImage(userDetails.getUser(), file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}