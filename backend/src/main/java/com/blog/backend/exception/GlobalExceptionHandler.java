package com.blog.backend.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(UserAlreadyExistsException.class)
        public ResponseEntity<ApiErrorResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.CONFLICT.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // <<< User Not Found Exception Handler >>> \\
        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<ApiErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.NOT_FOUND.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
                Map<String, String> fieldErrors = new HashMap<>();
                for (FieldError error : ex.getBindingResult().getFieldErrors()) {
                        fieldErrors.put(error.getField(), error.getDefaultMessage());
                }

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message("Validation failed")
                                                .errors(fieldErrors)
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiErrorResponse> handleRuntimeException(RuntimeException ex) {
                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                                .message("An unexpected error occurred: " + ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // <<==>> \\ <<==>>>
        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<ApiErrorResponse> handleInvalidCredentialsException(
                        InvalidCredentialsException ex) {
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.UNAUTHORIZED.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // HER I HANDLE WHEN THERE IS MISS MATCH OF THE EXECT HTTP METHOD USED IN THE
        // REQUEST AND THE ENDPOINT'S EXPECTED METHOD
        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ApiErrorResponse> handleMethodNotSupported(
                        HttpRequestMethodNotSupportedException ex) {
                return ResponseEntity
                                .status(HttpStatus.METHOD_NOT_ALLOWED)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                                                .message(
                                                                "HTTP method " + ex.getMethod()
                                                                                + " is not supported for this endpoint")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // <<< Subscription Exeption >> !
        @ExceptionHandler(SelfSubscriptionException.class)
        public ResponseEntity<ApiErrorResponse> handleSelfSubscription(SelfSubscriptionException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(AlreadySubscribedException.class)
        public ResponseEntity<ApiErrorResponse> handleAlreadySubscribed(AlreadySubscribedException ex) {
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.CONFLICT.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(NotSubscribedException.class)
        public ResponseEntity<ApiErrorResponse> handleNotSubscribed(NotSubscribedException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // << => POST EXCEPTION <= >>!
        @ExceptionHandler(PostNotFoundException.class)
        public ResponseEntity<ApiErrorResponse> handlePostNotFound(PostNotFoundException ex) {
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.NOT_FOUND.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(NotPostOwnerException.class)
        public ResponseEntity<ApiErrorResponse> handleNotPostOwner(NotPostOwnerException ex) {
                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.FORBIDDEN.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // post errror !!
        @ExceptionHandler(InvalidMediaException.class)
        public ResponseEntity<ApiErrorResponse> handleInvalidMedia(InvalidMediaException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // <<==>>> \\
        // This error it's happning the seervlet matching paramtter entry point to
        // restcontroller
        @ExceptionHandler(MissingServletRequestParameterException.class)
        public ResponseEntity<ApiErrorResponse> handleMissingParameter(MissingServletRequestParameterException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message("Missing required parameter: " + ex.getParameterName())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // <<likes exeption handler >>
        @ExceptionHandler(AlreadyLikedException.class)
        public ResponseEntity<ApiErrorResponse> handleAlreadyLiked(AlreadyLikedException ex) {
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.CONFLICT.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(NotLikedException.class)
        public ResponseEntity<ApiErrorResponse> handleNotLiked(NotLikedException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }
        
        // mismatching data type exception !
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiErrorResponse.builder()
                                                .status(HttpStatus.BAD_REQUEST.value())
                                                .message("Invalid value for parameter '" + ex.getName() + "': "
                                                                + ex.getValue())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }
}
