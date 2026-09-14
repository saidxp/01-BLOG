package com.blog.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.blog.backend.user.enums.*;;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder 

public class UserDto { 
    private Long id;
    private String email;
    private String username;
    private String avatarUrl;
    private Role role; // <<==>> \\  
}
 