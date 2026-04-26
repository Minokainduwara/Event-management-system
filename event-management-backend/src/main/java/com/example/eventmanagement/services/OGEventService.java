package com.example.eventmanagement.services;

import com.example.eventmanagement.entity.OGEvent;
import com.example.eventmanagement.repository.OGEventRepository;
import com.example.eventmanagement.dto.OGCreateEventDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OGEventService {

    @Autowired
    private OGEventRepository eventRepository;

    public List<OGEvent> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<OGEvent> getEventById(int id) {
        return eventRepository.findById(id);
    }

    public OGEvent saveEvent(OGCreateEventDto dto) {
        OGEvent event = new OGEvent();
        event.setEventTitle(dto.getEventTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setEventTime(dto.getEventTime());
        event.setLocation(dto.getLocation());
        event.setMaxParticipants(dto.getMaxParticipants());
        event.setStatus(dto.getStatus() != null ? dto.getStatus() : OGEvent.Status.UPCOMING);
        event.setImage(dto.getImage());
        event.setCategoryId(dto.getCategoryId());
        return eventRepository.save(event);
    }

    public OGEvent updateEvent(int id, OGCreateEventDto dto) {
        OGEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setEventTitle(dto.getEventTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setEventTime(dto.getEventTime());
        event.setLocation(dto.getLocation());
        event.setMaxParticipants(dto.getMaxParticipants());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());
        event.setImage(dto.getImage());
        event.setCategoryId(dto.getCategoryId());
        
        return eventRepository.save(event);
    }

    public void deleteEvent(int id) {
        eventRepository.deleteById(id);
    }

    public List<OGEvent> searchEvents(String keyword) {
        return eventRepository.findByEventTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    public List<OGEvent> filterEventsByCategory(int categoryId) {
        return eventRepository.findByCategoryId(categoryId);
    }

    public OGEvent updateEventStatus(int id, OGEvent.Status status) {
        OGEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(status);
        return eventRepository.save(event);
    }

    public List<Map<String, Object>> getCategoryCounts() {
        return eventRepository.getCategoryCounts();
    }
}
