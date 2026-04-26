package com.example.eventmanagement.controller;

import com.example.eventmanagement.entity.OGRegistration;
import com.example.eventmanagement.services.OGRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eventRegistrations")
public class OGRegistrationController {

    @Autowired
    private OGRegistrationService registrationService;

    @GetMapping("/registration")
    public ResponseEntity<?> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        return ResponseEntity.ok(registrationService.getRegistrationSummary());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getRegistrationsByEvent(@PathVariable int eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEventId(eventId));
    }

    @GetMapping("/count/{eventId}")
    public ResponseEntity<?> getRegistrationCount(@PathVariable int eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationCountByEventId(eventId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestParam OGRegistration.Status status) {
        try {
            return ResponseEntity.ok(registrationService.updateRegistrationStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable int id) {
        registrationService.deleteRegistration(id);
        return ResponseEntity.ok().build();
    }
}
