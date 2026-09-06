package com.blog.backend.media.service;
import com.blog.backend.media.model.MediaUpload;
import com.blog.backend.media.repository.MediaUploadRepository;
import com.blog.backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;  
import com.blog.backend.post.storage.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaUploadService {

    private final MediaUploadRepository mediaUploadRepository;
    private final MediaStorageService mediaStorageService; // 
    @Transactional
    public String uploadImage(User uploader, MultipartFile file) {
        String url = mediaStorageService.store(file);

        MediaUpload upload = MediaUpload.builder()
                .url(url)
                .uploadedBy(uploader)
                .confirmed(false)
                .build();

        mediaUploadRepository.save(upload);
        return url;
    }

    @Transactional
    public void confirmUploadsUsedIn(String content) {
        List<String> urlsInContent = extractImageUrls(content);
        if (urlsInContent.isEmpty()) {
            return;
        }
        List<MediaUpload> matchingUploads = mediaUploadRepository.findByUrlIn(urlsInContent);
        matchingUploads.forEach(upload -> upload.setConfirmed(true));
        mediaUploadRepository.saveAll(matchingUploads);
    }

    private List<String> extractImageUrls(String content) {
        // matches markdown image syntax: ![alt](url)
        var pattern = java.util.regex.Pattern.compile("!\\[[^\\]]*\\]\\(([^)]+)\\)");
        var matcher = pattern.matcher(content);
        return matcher.results()
                .map(match -> match.group(1))
                .toList();
    }
    
}