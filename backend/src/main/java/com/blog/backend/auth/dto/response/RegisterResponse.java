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

    @Builder.Default
    private String message = "Youuuuu Are Registered Successfully ";
    private String username;
    private String email;
}
