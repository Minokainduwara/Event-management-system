package com.example.demo.controller;

import com.example.demo.model.EventRegistration;
import com.example.demo.model.EventRegistrationDTO;
import com.example.demo.model.RegistrationSummary;
import com.example.demo.services.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventRegistrations")
@CrossOrigin("*")
public class EventRegistrationController {
    @Autowired
    private EventRegistrationService eventRegistrationService;

    @GetMapping("/registration")
    public List<EventRegistrationDTO> getAllRegistrations()
    {
        return eventRegistrationService.getAllRegistrations();
    }
    @GetMapping("/summary")
    public RegistrationSummary getRegistrationSummary()
    {
        return eventRegistrationService.getRegistrationSummary();
    }
    @GetMapping("/{eventId}/search")
    public List<EventRegistration> searchRegisteredStudent(@PathVariable Integer eventId,@RequestParam String keyword){
        return eventRegistrationService.searchRegisteredStudent(eventId,keyword);
    }
    @GetMapping("/{eventId}/search")
    public List<EventRegistration> searchRegisteredStudents(@PathVariable Long eventId, @RequestParam String keyword, @RequestParam(required = false) String status) {
        return eventRegistrationService.searchRegisteredStudents(eventId, keyword, status);
    }
}
