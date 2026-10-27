package com.blog.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    // Single source of truth: the public host/port come from .env (APP_HOST / APP_PORT).
    // To move the app to a new machine/IP you only change .env — never this file.
    @Value("${app.host:localhost}")
    private String appHost;

    @Value("${app.public-port:8443}")
    private int appPort;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // The origin users actually browse to, e.g. https://192.168.11.235:8443
        final String publicOrigin = "https://" + appHost + ":" + appPort;
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        // Patterns (not exact origins) so any localhost port is allowed for
                        // direct local access, mirroring WebSocketConfig. publicOrigin stays exact.
                        .allowedOriginPatterns(
                                // Local development / direct-localhost access (any port).
                                "http://localhost:*",
                                "https://localhost:*",
                                // The public origin from .env (APP_HOST/APP_PORT).
                                publicOrigin
                        )
                        .allowedMethods(
                                "GET", "POST", "PUT", "DELETE",
                                "PATCH", "OPTIONS"
                        )
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
