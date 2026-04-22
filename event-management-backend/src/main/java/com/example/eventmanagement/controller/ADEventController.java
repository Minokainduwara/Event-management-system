package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.ADEvent;
import com.example.eventmanagement.model.ADEventCategory;
import com.example.eventmanagement.repository.ADCategoryRepository;
import com.example.eventmanagement.services.ADEventService;
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
    private ADEventService ADEventService;

    @Autowired
    private ADCategoryRepository ADCategoryRepository;

    @PostMapping("/saveEvent")
    public ADEvent saveEvent(@RequestBody ADEvent event)
    {
        return ADEventService.saveEvent(event);
    }
    @GetMapping("/allEvents")
    public List<ADEvent> getAllEvent()
    {
        return ADEventService.getAllEvent();
    }
    @GetMapping("/getEvent/{id}")
    public ADEvent getEventById(@PathVariable Integer id ){
        return ADEventService.getEventById(id);
    }
    @DeleteMapping("/deleteEvent/{id}")
   public String deleteEvent(@PathVariable Integer id)
   {
       ADEventService.deleteEvent(id);
       return "Event Delete Successfully";
   }
   @PutMapping("updateEvent/{id}")
   public ADEvent updateEvent(@PathVariable  Integer id, @RequestBody ADEvent event){
        return ADEventService.updateEvent(id,event);

   }
   @GetMapping("/searchEvent")
   public List<ADEvent> getEventByName(@RequestParam String keyword){
        return ADEventService.getEventByName(keyword);
   }
@GetMapping("/filter")
   public List<ADEvent> getEventByCategory(@RequestParam Integer categoryId){
        ADEventCategory category= ADCategoryRepository.findById(categoryId).orElse(null);
        return  ADEventService.getEventByCategory(categoryId);
   }
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<ADEvent> updateEventStatus(@PathVariable Integer id, @RequestParam String status) {
        ADEvent event= ADEventService.updateEventStatus(id, status);
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
