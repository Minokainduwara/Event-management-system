package com.example.demo.services;

import com.example.demo.model.Event;
import com.example.demo.model.EventCategory;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    public Event saveEvent(Event event){
        Integer categoryId = event.getCategory().getCategoryId();
        EventCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        event.setCategory(category);
        return eventRepository.save(event);

    }
    public List<Event> getAllEvent()
    {
        return eventRepository.findAll();
    }
    public Event getEventById(int id)
    {
        return eventRepository.findById(id).orElse(null);
    }
    public void deleteEvent(int id){
        if(!eventRepository.existsById(id)){
            throw new RuntimeException("Event is not found with id:"+id);
        }

        eventRepository.deleteById(id);
    }
    public Event updateEvent(int id,Event event){
        Event e=eventRepository.findById(id).orElse(null);

        if(e!=null)
        {
            e.setEventTitle(event.getEventTitle());
            e.setDescription(event.getDescription());
            e.setLocation(event.getLocation());
            e.setEventDate(event.getEventDate());
            e.setEventTime(event.getEventTime());
            e.setStatus(event.getStatus());
            e.setMaxParticipants(event.getMaxParticipants());
            e.setCategory(event.getCategory());
            e.setUser(event.getUser());

            return  eventRepository.save(e);
        }
        return  null;
    }

    public List<Event> getEventByName(String keyword)
    {
        return eventRepository.findByEventTitleContainingIgnoreCase(keyword);
    }

    public List<Event> getEventByCategory(Integer categoryId)
    {
        if(categoryId==null){
            return eventRepository.findAll();
        }
        return eventRepository.findByCategory_CategoryId(categoryId);
    }
    // In EventService.java
    public Event updateEventStatus(Integer id, String status) {
        Event event = getEventById(id);
        if (event == null) {
            return null;
        }
        event.setStatus(status);
        return saveEvent(event);
    }
}
