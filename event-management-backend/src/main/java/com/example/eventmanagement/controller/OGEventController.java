package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.OGEvent;
import com.example.eventmanagement.dto.OGCreateEventDto;
import com.example.eventmanagement.services.OGEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class OGEventController {

    @Autowired
    private OGEventService eventService;

    @GetMapping("/allEvents")
    public ResponseEntity<?> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/getEvent/{id}")
    public ResponseEntity<?> getEventById(@PathVariable int id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/saveEvent")
    public ResponseEntity<?> saveEvent(@RequestBody OGCreateEventDto dto) {
        return ResponseEntity.ok(eventService.saveEvent(dto));
    }

    @PutMapping("/updateEvent/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable int id, @RequestBody OGCreateEventDto dto) {
        try {
            return ResponseEntity.ok(eventService.updateEvent(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteEvent/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable int id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/searchEvent")
    public ResponseEntity<?> searchEvent(@RequestParam String keyword) {
        return ResponseEntity.ok(eventService.searchEvents(keyword));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterEventsByCategory(@RequestParam int categoryId) {
        return ResponseEntity.ok(eventService.filterEventsByCategory(categoryId));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateEventStatus(@PathVariable int id, @RequestParam OGEvent.Status status) {
        try {
            return ResponseEntity.ok(eventService.updateEventStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category-counts")
    public ResponseEntity<?> getCategoryCounts() {
        return ResponseEntity.ok(eventService.getCategoryCounts());
    }
}
