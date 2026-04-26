package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.ADAnnouncement;
import com.example.eventmanagement.repository.ADAnnouncementRepository;
import com.example.eventmanagement.services.ADAnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcement")
@CrossOrigin(origins = "http://localhost:5173")
public class ADAnnouncementController {

    @Autowired
    private ADAnnouncementService ADAnnouncementService;
    @Autowired
    private ADAnnouncementRepository ADAnnouncementRepository;


    @PostMapping("/add")
    public ADAnnouncement addAnnouncement(
            @RequestBody ADAnnouncement ADAnnouncement
    ) {
        return ADAnnouncementService.addAnnouncement(ADAnnouncement);
    }


    @GetMapping("/all")
    public List<ADAnnouncement> getAllAnnouncements() {
        return ADAnnouncementService.getAllAnnouncements();
    }


    @PutMapping("/update/{id}")
    public ADAnnouncement updateAnnouncement(
            @PathVariable int id,
            @RequestBody ADAnnouncement ADAnnouncement
    ) {
        return ADAnnouncementService.updateAnnouncement(id, ADAnnouncement);
    }


    @DeleteMapping("/delete/{id}")
    public String deleteAnnouncement(@PathVariable int id) {
        ADAnnouncementService.deleteAnnouncement(id);
        return "Deleted successfully";
    }
    @GetMapping("/count")
    public long countAnnouncements() {
        return ADAnnouncementRepository.count();
    }
}
