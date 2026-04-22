package com.example.eventmanagement.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.dto.EventDTO;
import com.example.eventmanagement.dto.RegistrationDetailDTO;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Registration;
import com.example.eventmanagement.model.RegistrationStatus;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class RegistrationService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Transactional(rollbackFor = Exception.class)
    public void register(Long studentId, Long eventId) throws Exception {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new Exception("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));

        if (registrationRepository.existsByStudentAndEvent(student, event)) {
            throw new Exception("Already registered for this event");
        }

        if (event.getSeatsAvailable() == null || event.getSeatsAvailable() <= 0) {
            throw new Exception("No seats available");
        }

        event.setSeatsAvailable(event.getSeatsAvailable() - 1);
        eventRepository.save(event);

        try {
            registrationRepository.save(Registration.builder()
                    .student(student)
                    .event(event)
                    .status(RegistrationStatus.CONFIRMED)
                    .build());
        } catch (DataIntegrityViolationException ex) {
            throw new Exception("Registration failed due to database constraint");
        }
    }

    public List<RegistrationDetailDTO> getMyRegistrations(Long studentId) throws Exception {
        userRepository.findById(studentId)
                .orElseThrow(() -> new Exception("User not found"));

        return registrationRepository.findByStudentId(studentId).stream()
                .map(this::toDetailDto)
                .collect(Collectors.toList());
    }

    private RegistrationDetailDTO toDetailDto(Registration registration) {
        return RegistrationDetailDTO.builder()
                .eventId(registration.getEvent().getId())
                .event(toEventDto(registration.getEvent()))
                .status(registration.getStatus().getValue())
                .requestedAt(formatRequestedAt(registration.getRequestedAt()))
                .build();
    }

    private EventDTO toEventDto(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .category(event.getCategory())
                .date(formatEventDate(event.getEventDate()))
                .time(formatEventTime(event.getEventTime()))
                .location(event.getLocation())
                .organizer(event.getOrganizer())
                .description(event.getDescription())
                .seatsAvailable(event.getSeatsAvailable())
                .build();
    }

    private String formatEventDate(LocalDate eventDate) {
        if (eventDate == null) {
            return null;
        }
        return eventDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH));
    }

    private String formatEventTime(LocalTime eventTime) {
        if (eventTime == null) {
            return null;
        }
        return eventTime.format(DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH));
    }

    private String formatRequestedAt(LocalDateTime requestedAt) {
        if (requestedAt == null) {
            return null;
        }
        return requestedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
    }
}