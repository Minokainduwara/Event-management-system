package com.example.demo.repository;

import com.example.demo.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration,Integer> {
    int CountByUserId(int userId);
    List<EventRegistration> findAll();
    long count();
    long countByStatus(String status);
    List<EventRegistration> findByEventIdAndNameContainingIgnoreCaseOrEventIdAndUniversityIdContainingIgnoreCase(Integer eventId1,String name,Integer eventId2,String university_id);
    List<EventRegistration> findByEventIdAndStatusAndNameContainingIgnoreCaseOrEventIdAndStatusAndUniversityIdContainingIgnoreCase(Long eventId1, String status, String name, Long eventId2, String status2, String universityId);

}
