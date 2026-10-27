package com.blog.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.blog.backend.user.enums.Role;
import com.blog.backend.user.enums.UserStatus;
import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Runs once at startup (after Flyway migrations) and makes sure every username listed in
 * "app.bootstrap-admin-usernames" exists AND has the ADMIN role.
 *
 *   - user already exists  -> promoted to ADMIN (no other fields touched)
 *   - user does not exist  -> CREATED as ADMIN with the seed bootstrap password
 *
 * An empty list means the feature is disabled (nothing happens, no error).
 * This is what gives the OTHER laptop (and any fresh environment) an admin automatically:
 * just set BOOTSTRAP_ADMIN_USERNAMES=yourname (and optionally BOOTSTRAP_ADMIN_PASSWORD=...)
 * in that machine's .env, start the backend, and the admin is ready to log in.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap-admin-usernames:}")
    private String bootstrapAdminUsernames;

    @Value("${app.bootstrap-admin-password:ChangeMe123!}")
    private String bootstrapAdminPassword;

    @Override
    public void run(String... args) {
        if (bootstrapAdminUsernames == null || bootstrapAdminUsernames.isBlank()) {
            log.info("Admin bootstrap disabled (app.bootstrap-admin-usernames is empty).");
            return;
        }

        for (String raw : bootstrapAdminUsernames.split(",")) {
            String username = raw.trim().toLowerCase();
            if (username.isEmpty()) {
                continue;
            }
            try {
                bootstrapOne(username);
            } catch (Exception e) {
                // Never let a single bad entry abort application startup.
                log.error("Admin bootstrap failed for username '{}': {}", username, e.getMessage());
            }
        }
    }

    private void bootstrapOne(String username) {
        userRepository.findByUsername(username).ifPresentOrElse(existing -> {
            if (existing.getRole() == Role.ADMIN) {
                log.info("Admin bootstrap: user '{}' is already ADMIN.", username);
            } else {
                existing.setRole(Role.ADMIN);
                userRepository.save(existing);
                log.warn("Admin bootstrap: PROMOTED existing user '{}' to ADMIN.", username);
            }
        }, () -> {
            String email = username + "@admin.local";
            if (userRepository.existsByEmail(email)) {
                log.warn("Admin bootstrap: cannot create '{}' — placeholder email '{}' is already taken.",
                        username, email);
                return;
            }
            User admin = User.builder()
                    .username(username)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(bootstrapAdminPassword))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.warn("Admin bootstrap: CREATED admin '{}' (email '{}'). "
                    + "Log in with the bootstrap password and CHANGE it immediately.", username, email);
        });
    }
}
