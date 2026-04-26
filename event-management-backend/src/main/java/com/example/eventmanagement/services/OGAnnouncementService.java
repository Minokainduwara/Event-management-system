package com.example.eventmanagement.services;

import com.example.eventmanagement.entity.OGAnnouncement;
import com.example.eventmanagement.repository.OGAnnouncementRepository;
import com.example.eventmanagement.dto.OGCreateAnnouncementDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OGAnnouncementService {

    @Autowired
    private OGAnnouncementRepository announcementRepository;

    public List<OGAnnouncement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public OGAnnouncement addAnnouncement(OGCreateAnnouncementDto dto) {
        OGAnnouncement announcement = new OGAnnouncement();
        announcement.setTitle(dto.getTitle());
        announcement.setMessage(dto.getMessage());
        // In a real application, createdBy would come from the logged-in user
        announcement.setCreatedBy(1); // placeholder
        return announcementRepository.save(announcement);
    }

    public OGAnnouncement updateAnnouncement(int id, OGCreateAnnouncementDto dto) {
        OGAnnouncement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcement.setTitle(dto.getTitle());
        announcement.setMessage(dto.getMessage());
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(int id) {
        announcementRepository.deleteById(id);
    }
}
