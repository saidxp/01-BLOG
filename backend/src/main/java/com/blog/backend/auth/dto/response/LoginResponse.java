package com.blog.backend.auth.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    // <<<===>>> \ ((!!))
    @Builder.Default
    private String message = "You Are Logged In Successfully ";
    private String accessToken;
}