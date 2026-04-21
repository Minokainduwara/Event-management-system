package com.example.demo.controller;

import com.example.demo.model.Announcement;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.services.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcement")
@CrossOrigin("*")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;
    @Autowired
    private AnnouncementRepository announcementRepository;


    @PostMapping("/add")
    public Announcement addAnnouncement(
            @RequestBody Announcement announcement
    ) {
        return announcementService.addAnnouncement(announcement);
    }


    @GetMapping("/all")
    public List<Announcement> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }


    @PutMapping("/update/{id}")
    public Announcement updateAnnouncement(
            @PathVariable int id,
            @RequestBody Announcement announcement
    ) {
        return announcementService.updateAnnouncement(id, announcement);
    }


    @DeleteMapping("/delete/{id}")
    public String deleteAnnouncement(@PathVariable int id) {
        announcementService.deleteAnnouncement(id);
        return "Deleted successfully";
    }
    @GetMapping("/count")
    public long countAnnouncements() {
        return announcementRepository.count();
    }
}
