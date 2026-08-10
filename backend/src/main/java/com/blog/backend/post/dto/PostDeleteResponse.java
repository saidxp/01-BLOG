package com.blog.backend.post.dto;

public record PostDeleteResponse(boolean deleted, Long postId, String message) {
}