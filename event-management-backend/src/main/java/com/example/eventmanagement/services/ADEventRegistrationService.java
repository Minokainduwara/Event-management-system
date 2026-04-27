package com.example.eventmanagement.services;

import com.example.eventmanagement.ADenum.EventStatus;
import com.example.eventmanagement.enums.Role;
import com.example.eventmanagement.model.*;
import com.example.eventmanagement.repository.ADEventRegistrationRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ADEventRegistrationService {

    @Autowired
    private ADEventRegistrationRepository ADEventRegistrationRepository;

    @Autowired
    private ADUserRepository ADUserRepository;

    @Autowired
    private ADEventRepository ADEventRepository;

    public List<ADEventRegistration> getAllRegistrations() {
        return ADEventRegistrationRepository.findAll();
    }

    public ADRegistrationSummary getRegistrationSummary() {
        ADRegistrationSummary summary = new ADRegistrationSummary();
        summary.setTotal(ADEventRegistrationRepository.count());
        summary.setConfirmed(ADEventRegistrationRepository.countByStatus("confirmed"));
        summary.setAttended(ADEventRegistrationRepository.countByStatus("attended"));
        summary.setPending(ADEventRegistrationRepository.countByStatus("pending"));
        summary.setCancelled(ADEventRegistrationRepository.countByStatus("cancelled"));
        return summary;
    }

    public List<ADEventRegistration> searchRegisteredStudent(String keyword) {
        return ADEventRegistrationRepository
                .findByUser_NameContainingIgnoreCaseOrUser_UniversityIdContainingIgnoreCase(keyword, keyword);
    }

    public List<ADEventRegistration> searchRegisteredStudents(String status) {
        return ADEventRegistrationRepository.findByStatus(status);
    }

    public ADEventRegistration updateStatus(int id, String status) {
        ADEventRegistration reg = ADEventRegistrationRepository.findById(id).orElse(null);
        if (reg != null) {
            reg.setStatus(status);
            return ADEventRegistrationRepository.save(reg);
        }
        return null;
    }

    public void deleteRegistration(int id) {
        ADEventRegistrationRepository.deleteById(id);
    }

    public int getConfirmedCount(int eventId) {
        return ADEventRegistrationRepository.countByEvent_EventIdAndStatus(eventId, "confirmed");
    }

    public List<ADEventRegistration> getRegistrationsByEventId(int eventId) {
        return ADEventRegistrationRepository.findByEvent_EventId(eventId);
    }

    public List<ADEventRegistration> getRegistrationsByUserEmail(String email, String keyword, String status) {
        List<ADEventRegistration> registrations = ADEventRegistrationRepository.findByUser_Email(email);

        if (status != null && !status.isEmpty()) {
            registrations = registrations.stream()
                    .filter(reg -> status.equalsIgnoreCase(reg.getStatus()))
                    .collect(Collectors.toList());
        }

        if (keyword != null && !keyword.isEmpty()) {
            String lower = keyword.toLowerCase();
            registrations = registrations.stream()
                    .filter(reg ->
                            (reg.getEventName() != null && reg.getEventName().toLowerCase().contains(lower)) ||
                                    (reg.getLocation() != null && reg.getLocation().toLowerCase().contains(lower)) ||
                                    (reg.getCategory() != null && reg.getCategory().toLowerCase().contains(lower))
                    )
                    .collect(Collectors.toList());
        }

        return registrations;
    }

    public Map<String, Long> getMyRegistrationStats(String email) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalRegistrations", ADEventRegistrationRepository.countByUser_Email(email));
        stats.put("confirmed",  ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "confirmed"));
        stats.put("pending",    ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "pending"));
        stats.put("attended",   ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "attended"));
        stats.put("cancelled",  ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "cancelled"));
        return stats;
    }

    public String registerStudent(int userId, int eventId) {

        // 1. Prevent duplicate registration
        if (ADEventRegistrationRepository.existsByUser_UserIdAndEvent_EventId(userId, eventId)) {
            return "You are already registered for this event!";
        }

        // 2. Get user
        ADUser user = ADUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Check role
        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can register!");
        }

        // 4. Get event
        ADEvent event = ADEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 5. Check event status
        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new RuntimeException("Event is not open for registration");
        }

        // 6. Check capacity (using PENDING count, not APPROVED)
        int pendingCount = ADEventRegistrationRepository
                .countByEvent_EventIdAndStatus(eventId, "PENDING");

        if (event.getMaxParticipants() != null &&
                pendingCount >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full!");
        }

        // 7. Save registration
        ADEventRegistration reg = new ADEventRegistration();
        reg.setUser(user);
        reg.setEvent(event);
        reg.setStatus("PENDING");
        reg.setRegistration_date(LocalDateTime.now());

        ADEventRegistrationRepository.save(reg);

        return "Registration successful!";
    }
}