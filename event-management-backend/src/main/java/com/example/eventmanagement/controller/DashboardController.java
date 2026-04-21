package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventmanagement.dto.DashboardStatsDTO;
import com.example.eventmanagement.security.JwtUserDetails;
import com.example.eventmanagement.service.StudentService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            DashboardStatsDTO stats = studentService.getDashboardStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    private Long getCurrentUserId(Authentication authentication) {
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getDetails();
        return userDetails.getUserId();
    }
}
