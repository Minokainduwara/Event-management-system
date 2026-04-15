package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/events")
@CrossOrigin("*")
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping("/saveEvent")
    public Event  saveEvent(@RequestBody Event event)
    {
        return eventService.saveEvent(event);
    }
    @GetMapping("/allEvents")
    public List<Event> getAllEvent()
    {
        return eventService.getAllEvent();
    }
    @GetMapping("/getEvent")
    public Event getEventById(Integer id ){
        return eventService.getEventById(id);
    }
    @DeleteMapping("/deleteEvent/{id}")
   public String deleteEvent(@PathVariable Integer id)
   {
       eventService.deleteEvent(id);
       return "Event Delete Successfully";
   }
   @PutMapping("updateEvent/{id}")
   public Event updateEvent(@PathVariable  Integer id,@RequestBody Event event){
        return eventService.updateEvent(id,event);

   }
   @GetMapping("/searchEvent")
   public List<Event> getEventByName(@RequestParam String keyword){
        return eventService.getEventByName(keyword);
   }


}
