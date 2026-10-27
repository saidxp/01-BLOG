package com.blog.backend.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * Binds the "app.ratelimit" block from application.yaml.
 * These are the numbers we later drop into each user's Box (Bucket).
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.ratelimit")
public class RateLimitProperties {

    // Master switch: false => the filter lets everything pass untouched.
    private boolean enabled = true;

    // The GLOBAL box (one per user/IP): "how much total this person may do".
    private long globalCapacity = 100;
    private long globalRefillPerMinute = 100;

    // The DOOR boxes (one per user x rule): "how much of THIS action this person may do".
    private List<Rule> rules = new ArrayList<>();

    @Data
    public static class Rule {
        private String name;                                 // door id: "auth" / "write" / "read"
        private List<String> methods = new ArrayList<>();    // empty list => any HTTP method
        private String match;                                // Ant pattern, e.g. "/api/auth/**"
        private long capacity;                               // tokens this door holds
        private long refillPerMinute;                        // tokens returned per minute
    }
}
