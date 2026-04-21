package com.example.demo.services;

import com.example.demo.model.Announcement;
import com.example.demo.model.User;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;


    public Announcement addAnnouncement(Announcement announcement) {
        int userId = announcement.getCreatedBy().getUserId();
        User user = userRepository.findById(userId)
                .orElse(null);
        if(user==null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Admin ID not found"
            );
        }
        if (user.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only ADMIN can create announcement"
            );
        }

        announcement.setCreatedBy(user);

        return announcementRepository.save(announcement);
    }


    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Announcement updateAnnouncement(int id, Announcement updatedAnnouncement) {

        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        a.setTitle(updatedAnnouncement.getTitle());
        a.setMessage(updatedAnnouncement.getMessage());

        return announcementRepository.save(a);
    }


    public void deleteAnnouncement(int id) {
        announcementRepository.deleteById(id);
    }
}
