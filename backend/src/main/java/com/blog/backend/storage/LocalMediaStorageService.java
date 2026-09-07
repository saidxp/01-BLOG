package com.blog.backend.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class LocalMediaStorageService implements MediaStorageService {

    private static final String UPLOAD_DIR = "uploads/media/";

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public String store(MultipartFile file) {
        try {
            Files.createDirectories(Path.of(UPLOAD_DIR));
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path target = Path.of(UPLOAD_DIR, filename);
            Files.copy(file.getInputStream(), target);
            return baseUrl + "/media/" + filename; 
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public void delete(String mediaUrl) {
        if (mediaUrl == null)
            return;
        String filename = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1);
        try {
            Files.deleteIfExists(Path.of(UPLOAD_DIR, filename));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains("."))
            return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}