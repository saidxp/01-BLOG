package com.blog.backend.post.dto;

import com.blog.backend.post.enums.MediaType;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Builder
@Getter 

public class PostDetailDto {
  private Long id;
  private String authorUsername;
  private String title;
  private String content;
  private String mediaUrl;
  private MediaType mediaType;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private boolean owner;
}
