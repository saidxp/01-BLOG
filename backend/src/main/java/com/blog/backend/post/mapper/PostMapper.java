package com.blog.backend.post.mapper;

import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.dto.PostId;
import com.blog.backend.post.model.Post;
import com.blog.backend.post.dto.PostDetailDto;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostDto toDto(Post post) {
        return PostDto.builder()
                .id(post.getId())
                .authorUsername(post.getUser().getUsername())
                .title(post.getTitle())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    // < Return It When Post It's Created >
    public PostId reDto(Post post) {
        return PostId.builder().id(post.getId()).build();
    }

    public PostDetailDto toDetailDto(Post post, Long currentUserId, boolean liked, long likedCount) {
        boolean isOwner = currentUserId != null && post.getUser().getId().equals(currentUserId);
        return PostDetailDto.builder()
                .id(post.getId())
                .authorUsername(post.getUser().getUsername())
                .title(post.getTitle())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .owner(isOwner)
                .liked(liked)
                .likedCount(likedCount)
                .build();
    }
}