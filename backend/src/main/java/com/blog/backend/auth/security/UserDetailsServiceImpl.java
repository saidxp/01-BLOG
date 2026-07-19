package com.blog.backend.auth.security;

import com.blog.backend.user.model.User;
import com.blog.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service; 

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository; 

    @Override
    public UserDetails loadUserByUsername(String identifier)
            throws UsernameNotFoundException {

        User user = userRepository
                .findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + identifier));

        return new CustomUserDetails(user);
    }
}