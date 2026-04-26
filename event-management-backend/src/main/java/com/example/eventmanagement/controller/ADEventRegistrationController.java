package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.ADEventRegistration;
import com.example.eventmanagement.model.ADRegistrationSummary;
import com.example.eventmanagement.services.ADEventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/eventRegistrations")
@CrossOrigin(origins = "http://localhost:5173")
public class ADEventRegistrationController {
    @Autowired
    private ADEventRegistrationService ADEventRegistrationService;

    @GetMapping("/registration")
    public List<ADEventRegistration> getAllRegistrations()
    {
        return ADEventRegistrationService.getAllRegistrations();
    }
    @GetMapping("/summary")
    public ADRegistrationSummary getRegistrationSummary()
    {
        return ADEventRegistrationService.getRegistrationSummary();
    }
    @GetMapping("/search")
    public List<ADEventRegistration> searchRegisteredStudent(@RequestParam String keyword){
        return ADEventRegistrationService.searchRegisteredStudent(keyword);
    }
    @GetMapping("/filter")
    public List<ADEventRegistration> searchRegisteredStudents(@RequestParam(required = false) String status) {
        return ADEventRegistrationService.searchRegisteredStudents( status);
    }
    @PutMapping("/{id}/status")
    public ADEventRegistration updateStatus(
            @PathVariable int id,
            @RequestParam String status
    ) {
        return ADEventRegistrationService.updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
    public void deleteRegistration(@PathVariable int id) {
        ADEventRegistrationService.deleteRegistration(id);
    }

    @GetMapping("/count/{eventId}")
    public int getCount(@PathVariable int eventId) {
        return ADEventRegistrationService.getConfirmedCount(eventId);
    }
    @GetMapping("/event/{eventId}")
    public List<ADEventRegistration> getRegistrationsByEvent(@PathVariable int eventId) {
        return ADEventRegistrationService.getRegistrationsByEventId(eventId);
    }

    @GetMapping("/my")
    public List<ADEventRegistration> getMyRegistrations(
            Authentication auth,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {

        String email = auth.getName();

        return ADEventRegistrationService.getRegistrationsByUserEmail(email, keyword, status);
    }

    @GetMapping("/my/stats")
    public Map<String, Long> getMyRegistrationStats(Authentication auth) {
        String email = auth.getName();
        return ADEventRegistrationService.getMyRegistrationStats(email);
    }
}
