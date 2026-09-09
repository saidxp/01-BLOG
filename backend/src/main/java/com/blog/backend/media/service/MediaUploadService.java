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
import com.blog.backend.post.model.Post;
import java.util.regex.Pattern;
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
        mediaUploadRepository.save(upload); // <<==>> \\ (<!!>)
         return url;
    } // <<===>> \\ (!!>)
    // <<==>> <<==>> \\ (())
    @Transactional
    public void confirmUploadsUsedIn(Post post, String content) { 
        // Her i Get New Url From Content (!!) ... () 
        // let's say this the first time the post it's created ok !
        // and we are submiting it like that :
        // with there content and there id 
        // no  i inned to put the id in mediaupoad 
        // why ?
        // becuse there is a case where i iwll need to check to compore the new with old and pased on this id i 
        // I will get the old one !!
        List<String> newUrls = extractImageUrls(content); 
        List<MediaUpload> oldUploads = mediaUploadRepository.findByPost(post);
        for (MediaUpload upload : oldUploads) {
            if (!newUrls.contains(upload.getUrl())) {
                upload.setConfirmed(false);
                upload.setPost(null);
            }
        }
            mediaUploadRepository.saveAll(oldUploads);
        if (!newUrls.isEmpty()) { 
            List<MediaUpload> currentUploads = mediaUploadRepository.findByUrlIn(newUrls);
        for (MediaUpload upload : currentUploads) {
            upload.setConfirmed(true);
            upload.setPost(post);
            }
            mediaUploadRepository.saveAll(currentUploads);
        }
    }
 
    private List<String> extractImageUrls(String content) {
        List<String> urls = new java.util.ArrayList<>();
        // This For Image (!!)
        var imagePattern = Pattern.compile("!\\[[^\\]]*\\]\\(([^)]+)\\)");
        imagePattern.matcher(content).results().forEach(m -> urls.add(m.group(1)));
        // This Tags About Video (!!)
        var videoPattern = Pattern.compile("<video[^>]*src=\"([^\"]+)\"");
        videoPattern.matcher(content).results().forEach(m -> urls.add(m.group(1))); // <<==>> \\ (<!!>)
        return urls;
    }
}