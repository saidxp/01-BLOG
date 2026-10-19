package com.blog.backend.user.repository;

import com.blog.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
 
import java.util.*;

 
public interface UserRepository extends JpaRepository<User, Long> { 
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email); 
    List<User> findByUsernameContainingIgnoreCase(String username); 
}
