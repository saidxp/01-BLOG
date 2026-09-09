package com.blog.backend.exception;

public class InvalidMediaTypeException extends RuntimeException {
    public InvalidMediaTypeException(String message) {
        super(message);
    }
}