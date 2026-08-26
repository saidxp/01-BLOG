package com.blog.backend.exception;

public class SelfReportException extends RuntimeException {
    public SelfReportException(String message) {
        super(message);
    }
}