package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.security.JwtUserDetails;
import com.example.eventmanagement.service.StudentService;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StudentController {
    @Autowired
    private StudentService studentService;

    private Long getUserId(Authentication authentication) {
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getDetails();
        return userDetails.getUserId();
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getProfile(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            StudentProfileDTO profile = studentService.getStudentProfile(userId);
            return ResponseEntity.ok(ApiResponse.ok(profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            Authentication authentication,
            @RequestBody StudentProfileDTO profileDTO) {
        try {
            Long userId = getUserId(authentication);
            studentService.updateStudentProfile(userId, profileDTO);
            return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            DashboardStatsDTO stats = studentService.getDashboardStats(userId);
            return ResponseEntity.ok(ApiResponse.ok(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationDTO>>> getRegistrations(Authentication authentication) {
        try {
            Long userId = getUserId(authentication);
            List<RegistrationDTO> registrations = studentService.getStudentRegistrations(userId);
            return ResponseEntity.ok(ApiResponse.ok(registrations));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/registrations/{eventId}")
    public ResponseEntity<ApiResponse<RegistrationDTO>> getRegistration(
            Authentication authentication,
            @PathVariable Long eventId) {
        try {
            Long userId = getUserId(authentication);
            RegistrationDTO registration = studentService.getRegistrationForEvent(userId, eventId);
            return ResponseEntity.ok(ApiResponse.ok(registration));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/{eventId}")
    public ResponseEntity<ApiResponse<Void>> registerForEvent(
            Authentication authentication,
            @PathVariable Long eventId) {
        try {
            Long userId = getUserId(authentication);
            studentService.registerForEvent(userId, eventId);
            return ResponseEntity.ok(ApiResponse.ok("Event registration successful", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/registrations/{eventId}")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(
            Authentication authentication,
            @PathVariable Long eventId) {
        try {
            Long userId = getUserId(authentication);
            studentService.cancelRegistration(userId, eventId);
            return ResponseEntity.ok(ApiResponse.ok("Registration cancelled successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
