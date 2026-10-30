package com.blog.backend.user.repository;

import com.blog.backend.user.model.User;
import com.blog.backend.user.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;


public interface UserRepository extends JpaRepository<User, Long> { 
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email); 
    List<User> findByUsernameContainingIgnoreCase(String username); 

    // Admin user-list: every role except the one given (admins manage members, not each other).
    Page<User> findByRoleNot(Role role, Pageable pageable);
}
