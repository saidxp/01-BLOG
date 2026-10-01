package com.blog.backend.post.mapper;

import org.springframework.stereotype.Component;

import com.blog.backend.post.dto.PostDetailDto;
import com.blog.backend.post.dto.PostDto;
import com.blog.backend.post.dto.PostId;
import com.blog.backend.post.model.Post;

@Component
public class PostMapper {

    public PostDto toDto(Post post, long like, long comment) { 
        return PostDto.builder()
                .id(post.getId())
                .authorUsername(post.getUser().getUsername())
                .avatarUrl(post.getUser().getAvatarUrl())
                .title(post.getTitle())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .likesCount(like)
                .commentsCount(comment)
                .build();
    }

    // < Return It When Post It's Created >
    public PostId reDto(Post post) {
        return PostId.builder().id(post.getId()).build();
    }

    public PostDetailDto toDetailDto(Post post, Long currentUserId, boolean liked, long likedCount, long commentCount) {
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
                .commentCount(commentCount)
                .build();
    }  // <<==>> \\ (<!!>) (!) <(!)> () \\ (<!!>)
}