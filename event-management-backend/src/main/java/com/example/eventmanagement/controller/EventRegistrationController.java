package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.EventRegistration;
import com.example.eventmanagement.model.RegistrationSummary;
import com.example.eventmanagement.services.EventRegistrationService;
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
    public List<EventRegistration> getAllRegistrations()
    {
        return eventRegistrationService.getAllRegistrations();
    }
    @GetMapping("/summary")
    public RegistrationSummary getRegistrationSummary()
    {
        return eventRegistrationService.getRegistrationSummary();
    }
    @GetMapping("/search")
    public List<EventRegistration> searchRegisteredStudent(@RequestParam String keyword){
        return eventRegistrationService.searchRegisteredStudent(keyword);
    }
    @GetMapping("/filter")
    public List<EventRegistration> searchRegisteredStudents(  @RequestParam(required = false) String status) {
        return eventRegistrationService.searchRegisteredStudents( status);
    }
    @PutMapping("/{id}/status")
    public EventRegistration updateStatus(
            @PathVariable int id,
            @RequestParam String status
    ) {
        return eventRegistrationService.updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
    public void deleteRegistration(@PathVariable int id) {
        eventRegistrationService.deleteRegistration(id);
    }

    @GetMapping("/count/{eventId}")
    public int getCount(@PathVariable int eventId) {
        return eventRegistrationService.getConfirmedCount(eventId);
    }
    @GetMapping("/event/{eventId}")
    public List<EventRegistration> getRegistrationsByEvent(@PathVariable int eventId) {
        return eventRegistrationService.getRegistrationsByEventId(eventId);
    }
}
