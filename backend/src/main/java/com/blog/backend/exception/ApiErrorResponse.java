package com.blog.backend.exception;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ApiErrorResponse {
    private int status;
    private String message;
    private Object errors;
    private LocalDateTime timestamp;
}
