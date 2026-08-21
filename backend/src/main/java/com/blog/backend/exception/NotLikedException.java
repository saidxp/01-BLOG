package com.blog.backend.exception;

public class NotLikedException extends RuntimeException {
    public NotLikedException(String message) {
        super(message);
    }
}