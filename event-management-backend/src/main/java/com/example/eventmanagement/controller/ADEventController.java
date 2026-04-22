package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.EventCategory;
import com.example.eventmanagement.repository.CategoryRepository;
import com.example.eventmanagement.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin("http://localhost:5173")
public class ADEventController {
    @Autowired
    private EventService eventService;

    @Autowired
    private CategoryRepository categoryRepository;

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
    @GetMapping("/getEvent/{id}")
    public Event getEventById(@PathVariable Integer id ){
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
@GetMapping("/filter")
   public List<Event> getEventByCategory(@RequestParam Integer categoryId){
        EventCategory category=categoryRepository.findById(categoryId).orElse(null);
        return  eventService.getEventByCategory(categoryId);
   }
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<Event> updateEventStatus(@PathVariable Integer id, @RequestParam String status) {
        Event event=eventService.updateEventStatus(id, status);
        if(event==null){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(event);
    }
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "C:/Users/pc/OneDrive/Desktop/eventproject/Event_management_system/event-management-backend/uploads/";
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir + fileName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(fileName);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

}
