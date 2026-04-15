package com.example.demo.services;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public Event saveEvent(Event event){
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
            e.setEvent_title(event.getEvent_title());
            e.setDescription(event.getDescription());
            e.setLocation(event.getLocation());
            e.setEvent_date(event.getEvent_date());
            e.setEvent_time(event.getEvent_time());
            e.setStatus(event.getStatus());
           return  eventRepository.save(e);
        }
        return  null;
    }

    public List<Event> getEventByName(String keyword)
    {
        return eventRepository.findByEventTitleContainingIgnoreCase(keyword);
    }
}
