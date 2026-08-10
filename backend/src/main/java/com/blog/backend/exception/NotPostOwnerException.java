package com.blog.backend.exception;

public class NotPostOwnerException extends RuntimeException {
    public NotPostOwnerException(String message) {
        super(message);
    }
}