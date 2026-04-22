package com.example.eventmanagement.security;

import lombok.Data;

@Data
public class JwtUserDetails {
    private Long userId;
    private String email;
    private String role;

    public JwtUserDetails(Long userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }
}
