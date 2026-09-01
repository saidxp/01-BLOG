package com.blog.backend.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse { 
    // <<==>> \\ 
    private long id;
    private String email;
    private String username;
}
 