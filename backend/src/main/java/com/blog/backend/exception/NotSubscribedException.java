package com.blog.backend.exception;

public class NotSubscribedException extends RuntimeException {
    public NotSubscribedException(String message) {
        super(message);
    }
}