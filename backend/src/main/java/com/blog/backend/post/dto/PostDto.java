package com.blog.backend.post.dto;

import com.blog.backend.post.enums.MediaType;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime; 

@Getter
@Builder 
public class PostDto {
    
    private Long id;
    private String authorUsername; 
    private String avatarUrl;
    private String title;
    private String mediaUrl;
    private MediaType mediaType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt; 

    // <<==>> \\ Likes Count And Commment (!!)
    private Long likesCount;
    private Long commentsCount;
}
