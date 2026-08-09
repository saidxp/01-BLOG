package com.blog.backend.exception;

public class SelfSubscriptionException extends RuntimeException {
    public SelfSubscriptionException(String message) {
        super(message);
    }
}