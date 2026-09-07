package com.blog.backend.media.service;
import com.blog.backend.media.model.MediaUpload;
import com.blog.backend.media.repository.MediaUploadRepository;
import com.blog.backend.post.service.Validator;
import com.blog.backend.storage.*;
import com.blog.backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.blog.backend.post.enums.*;
import java.util.List;
@Service
@RequiredArgsConstructor
public class MediaUploadService {

    private final MediaUploadRepository mediaUploadRepository;
    private final MediaStorageService mediaStorageService; //
    private final Validator validator;

    @Transactional
    public String uploadImage(User uploader, MultipartFile file) {
        
        MediaType type = validator.validateAndDetectType(file);
        String url = mediaStorageService.store(file);

        MediaUpload upload = MediaUpload.builder()
                .url(url)
                .uploadedBy(uploader)
                .mediaType(type)
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
        List<String> urls = new java.util.ArrayList<>();
        // This For Image (!!)
        var imagePattern = java.util.regex.Pattern.compile("!\\[[^\\]]*\\]\\(([^)]+)\\)");
        imagePattern.matcher(content).results().forEach(m -> urls.add(m.group(1)));
        // This Tags About Video (!!)
        var videoPattern = java.util.regex.Pattern.compile("<video[^>]*src=\"([^\"]+)\"");
        videoPattern.matcher(content).results().forEach(m -> urls.add(m.group(1))); // <<==>> \\ (<!!>)
        return urls;
    }
}