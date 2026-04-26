package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.OGUser;
import com.example.eventmanagement.dto.OGChangePasswordDto;
import com.example.eventmanagement.services.OGUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class OGUserController {

    @Autowired
    private OGUserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<OGUser> user = userService.getProfile(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody OGUser updatedUser) {
        try {
            String email = authentication.getName();
            return ResponseEntity.ok(userService.updateProfile(email, updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication authentication, @RequestBody OGChangePasswordDto dto) {
        try {
            String email = authentication.getName();
            boolean success = userService.changePassword(email, dto);
            if (success) {
                return ResponseEntity.ok().body("Password changed successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid current password");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
