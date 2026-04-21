package com.example.demo.repository;

import com.example.demo.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration,Integer> {
    int countByUser_UserId(int userId);
    List<EventRegistration> findAll();
    long count();
    long countByStatus(String status);

    List<EventRegistration> findByUser_NameContainingIgnoreCaseOrUser_UniversityIdContainingIgnoreCase(String name, String universityId);
    List<EventRegistration> findByStatus(  String status);
    int countByEvent_EventIdAndStatus(int eventId, String status);
}
