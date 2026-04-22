package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.RegistrationActionResponse;
import com.example.eventmanagement.dto.RegistrationDetailDTO;
import com.example.eventmanagement.security.JwtUserDetails;
import com.example.eventmanagement.service.RegistrationService;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RegistrationController {
    @Autowired
    private RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<RegistrationActionResponse> register(
            Authentication authentication,
            @RequestBody RegistrationRequest request) {
        try {
            Long userId = getCurrentUserId(authentication);
            registrationService.register(userId, request.eventId());
            return ResponseEntity.ok(RegistrationActionResponse.builder()
                    .ok(true)
                    .message("Registration successful")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(RegistrationActionResponse.builder()
                    .ok(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<RegistrationDetailDTO>> getMyRegistrations(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            List<RegistrationDetailDTO> registrations = registrationService.getMyRegistrations(userId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    private Long getCurrentUserId(Authentication authentication) {
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getDetails();
        return userDetails.getUserId();
    }

    public record RegistrationRequest(Long eventId) {
    }
}
