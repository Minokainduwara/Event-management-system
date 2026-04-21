package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.StudentProfileDTO;
import com.example.eventmanagement.security.JwtUserDetails;
import com.example.eventmanagement.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<StudentProfileDTO> getCurrentUser(Authentication authentication) {
        try {
            Long userId = getAuthenticatedUserId(authentication);
            StudentProfileDTO profile = userService.getCurrentUser(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<StudentProfileDTO> updateCurrentUser(
            Authentication authentication,
            @RequestBody StudentProfileDTO profileDTO) {
        try {
            Long userId = getAuthenticatedUserId(authentication);
            StudentProfileDTO updated = userService.updateUserProfile(userId, profileDTO);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || authentication.getDetails() == null) {
            throw new IllegalStateException("Unauthorized");
        }

        JwtUserDetails userDetails = (JwtUserDetails) authentication.getDetails();
        return userDetails.getUserId();
    }
}
