package com.example.eventmanagement.services;

import com.example.eventmanagement.dto.RegisterRequest;
import com.example.eventmanagement.model.*;
import com.example.eventmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventRegistrationService {

    @Autowired
    private ADEventRegistrationRepository registrationRepository;

    @Autowired
    private ADEventRepository eventRepository;

    @Autowired
    private ADUserRepository userRepository;

    // MAIN REGISTER METHOD
    public String register(RegisterRequest request, int userId) {

        // 1. Load event
        ADEvent event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 2. Load user
        ADUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Prevent duplicate registration
        boolean alreadyRegistered =
                registrationRepository.existsByUser_UserIdAndEvent_EventId(
                        userId,
                        request.getEventId()
                );

        if (alreadyRegistered) {
            throw new RuntimeException("You are already registered for this event");
        }

        // 4. Check capacity
        long currentCount = registrationRepository.countByEvent_EventId(event.getEventId());

        if (event.getMaxParticipants() != null &&
                currentCount >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }

        // 5. Create registration
        ADEventRegistration reg = new ADEventRegistration();
        reg.setUser(user);
        reg.setEvent(event);
        reg.setRegistration_date(LocalDateTime.now());
        reg.setStatus("REGISTERED");

        registrationRepository.save(reg);

        return "Registered successfully";
    }
}