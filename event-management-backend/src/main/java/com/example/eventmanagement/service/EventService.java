package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.EventDTO;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private StudentService studentService;

    public List<EventDTO> getAllEvents() {
        return studentService.getAllEvents();
    }

    public List<EventDTO> getEventsByCategory(String category) {
        return studentService.getEventsByCategory(category);
    }
}
