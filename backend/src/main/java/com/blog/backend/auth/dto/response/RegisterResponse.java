package com.blog.backend.auth.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class RegisterResponse {
    private long id;
    private String email;
    private String username;
}