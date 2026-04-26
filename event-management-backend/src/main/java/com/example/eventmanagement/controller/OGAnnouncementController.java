package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.OGCreateAnnouncementDto;
import com.example.eventmanagement.services.OGAnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/announcement")
public class OGAnnouncementController {

    @Autowired
    private OGAnnouncementService announcementService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAnnouncement(@RequestBody OGCreateAnnouncementDto dto) {
        return ResponseEntity.ok(announcementService.addAnnouncement(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable int id, @RequestBody OGCreateAnnouncementDto dto) {
        try {
            return ResponseEntity.ok(announcementService.updateAnnouncement(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable int id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok().build();
    }
}
