package com.blog.backend.auth.config;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Base64 encoded secret used to sign JWTs.
     */
    private String secret;

    /**
     * Access token lifetime in milliseconds.
     */
    private long accessTokenExpiration;
}