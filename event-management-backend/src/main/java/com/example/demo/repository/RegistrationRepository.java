package com.example.demo.repository;

import com.example.demo.model.Event;
import com.example.demo.model.Registration;
import com.example.demo.model.RegistrationStatus;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long userId);
    boolean existsByStudentAndEvent(User student, Event event);
    long countByStudentId(Long studentId);
    List<Registration> findByStudentIdAndStatus(Long userId, RegistrationStatus status);
    Optional<Registration> findByStudentIdAndEventId(Long userId, Long eventId);
    long countByStudentIdAndStatus(Long userId, RegistrationStatus status);
}
