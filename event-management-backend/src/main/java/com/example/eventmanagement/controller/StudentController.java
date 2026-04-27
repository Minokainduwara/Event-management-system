package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.StudentDashboardDTO;
import com.example.eventmanagement.model.ADEvent;
import com.example.eventmanagement.model.ADEventRegistration;
import com.example.eventmanagement.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {
    @Autowired
    private StudentService service;


    @GetMapping("/events")
    public List<ADEvent> getEvents() {
        return service.getEvents();
    }


    @GetMapping("/count/{eventId}")
    public long getCount(@PathVariable int eventId) {
        return service.getEventCount(eventId);
    }


    @GetMapping("/myEvents/{userId}")
    public List<ADEventRegistration> myEvents(@PathVariable int userId) {
        return service.getMyEvents(userId);
    }


    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(401).body("Unauthorized - No Authentication");
        }

        String email = auth.getName();
        StudentDashboardDTO data = service.getDashboard(email);

        return ResponseEntity.ok(data);
    }
    @GetMapping("/activity/{userId}")
    public List<ADEventRegistration> getStudentActivity(@PathVariable int userId) {
        return service.getStudentActivity(userId);
    }
    @GetMapping("/events/search")
    public List<ADEvent> searchEvents(@RequestParam String keyword) {
        return service.searchEvents(keyword);
    }
    @GetMapping("/events/filter")
    public List<ADEvent> filterEvents(@RequestParam int categoryId) {
        return service.filterEventsByCategory(categoryId);
    }


}
