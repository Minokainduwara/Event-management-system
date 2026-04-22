package com.example.eventmanagement.services;

import com.example.eventmanagement.model.ADAnnouncement;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADAnnouncementRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ADAnnouncementService {

    @Autowired
    private ADAnnouncementRepository ADAnnouncementRepository;

    @Autowired
    private ADUserRepository ADUserRepository;


    public ADAnnouncement addAnnouncement(ADAnnouncement ADAnnouncement) {
        int userId = ADAnnouncement.getCreatedBy().getUserId();
        ADUser ADUser = ADUserRepository.findById(userId)
                .orElse(null);
        if(ADUser ==null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Admin ID not found"
            );
        }
        if (ADUser.getRole() != ADUser.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only ADMIN can create announcement"
            );
        }

        ADAnnouncement.setCreatedBy(ADUser);

        return ADAnnouncementRepository.save(ADAnnouncement);
    }


    public List<ADAnnouncement> getAllAnnouncements() {
        return ADAnnouncementRepository.findAll();
    }

    public ADAnnouncement updateAnnouncement(int id, ADAnnouncement updatedADAnnouncement) {

        ADAnnouncement a = ADAnnouncementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        a.setTitle(updatedADAnnouncement.getTitle());
        a.setMessage(updatedADAnnouncement.getMessage());

        return ADAnnouncementRepository.save(a);
    }


    public void deleteAnnouncement(int id) {
        ADAnnouncementRepository.deleteById(id);
    }
}
