package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.ADEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ADEventRegistrationRepository extends JpaRepository<ADEventRegistration,Integer> {
    int countByUser_UserId(int userId);
    List<ADEventRegistration> findAll();
    long count();
    long countByStatus(String status);

    List<ADEventRegistration> findByUser_NameContainingIgnoreCaseOrUser_UniversityIdContainingIgnoreCase(String name, String universityId);
    List<ADEventRegistration> findByStatus(String status);
    int countByEvent_EventIdAndStatus(int eventId, String status);
    List<ADEventRegistration> findByEvent_EventId(int eventId);
}
