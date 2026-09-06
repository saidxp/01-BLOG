package com.blog.backend.storage;

import org.springframework.web.multipart.MultipartFile;

public interface MediaStorageService {
    String store(MultipartFile file);
    void delete(String mediaUrl);
}