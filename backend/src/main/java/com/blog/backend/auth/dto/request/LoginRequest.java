package com.blog.backend.auth.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor

public class LoginRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "ops please respect the limit 3~100")
    private String identifier; 
    @NotBlank(message = "password is required")
    @Size(min = 3, max = 100, message = "ops please respcet the limit 3~100")
    private String password; 
}