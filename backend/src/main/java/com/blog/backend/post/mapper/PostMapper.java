package com.blog.backend.post.mapper;

import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.model.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostDto toDto(Post post) {
        return PostDto.builder()
                .id(post.getId())
                .authorUsername(post.getUser().getUsername())
                .title(post.getTitle())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}