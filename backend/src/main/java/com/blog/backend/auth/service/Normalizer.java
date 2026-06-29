package com.blog.backend.auth.service;

import org.springframework.stereotype.Component;
 
@Component
public class Normalizer {

    public String normalizeUsername(String username) {
        if (username == null) {
            return "";
        }
        return username.trim().toLowerCase();
    }
    // <<==>> \\ ((!!)) \\ <3 <3 
    public String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase();
    }
}
