package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.EventDTO;
import com.example.eventmanagement.service.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping
    public List<EventDTO> getEvents(@RequestParam(required = false) String category) {
        if (category == null || category.isBlank()) {
            return eventService.getAllEvents();
        }

        return eventService.getEventsByCategory(category);
    }
}
