package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.dto.*;
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
public class StudentService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public StudentProfileDTO getStudentProfile(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        return StudentProfileDTO.builder()
                .fullName(user.getFullName())
                .registrationNumber(user.getRegistrationNumber())
                .email(user.getEmail())
                .build();
    }

    public void updateStudentProfile(Long userId, StudentProfileDTO profileDTO) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        user.setFullName(profileDTO.getFullName());
        user.setRegistrationNumber(profileDTO.getRegistrationNumber());
        user.setEmail(profileDTO.getEmail());

        userRepository.save(user);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertEventToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::convertEventToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long eventId) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));
        return convertEventToDTO(event);
    }

    public List<RegistrationDTO> getStudentRegistrations(Long userId) throws Exception {
        userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        return registrationRepository.findByStudentId(userId).stream()
                .map(this::convertRegistrationToDTO)
                .collect(Collectors.toList());
    }

    public List<RegistrationDetailDTO> getStudentRegistrationsWithEventDetails(Long userId) throws Exception {
        userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        return registrationRepository.findByStudentId(userId).stream()
                .map(this::convertRegistrationToDetailDTO)
                .collect(Collectors.toList());
    }

    public RegistrationDTO getRegistrationForEvent(Long userId, Long eventId) throws Exception {
        Registration registration = registrationRepository.findByStudentIdAndEventId(userId, eventId)
                .orElseThrow(() -> new Exception("Registration not found"));
        return convertRegistrationToDTO(registration);
    }

        @Transactional
        public void registerForEvent(Long userId, Long eventId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));

                if (registrationRepository.existsByStudentAndEvent(user, event)) {
            throw new Exception("Already registered for this event");
        }

                if (event.getSeatsAvailable() == null || event.getSeatsAvailable() <= 0) {
                        throw new Exception("No seats available");
                }

                event.setSeatsAvailable(event.getSeatsAvailable() - 1);
                eventRepository.save(event);

        Registration registration = Registration.builder()
                .student(user)
                .event(event)
                .status(RegistrationStatus.CONFIRMED)
                .build();

        registrationRepository.save(registration);
    }

    public void cancelRegistration(Long userId, Long eventId) throws Exception {
                Registration registration = registrationRepository.findByStudentIdAndEventId(userId, eventId)
                .orElseThrow(() -> new Exception("Registration not found"));
        registrationRepository.delete(registration);
    }

    public DashboardStatsDTO getDashboardStats(Long userId) throws Exception {
        userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        int availableEvents = (int) eventRepository.count();
        int myRegistrations = (int) registrationRepository.countByStudentIdAndStatus(userId, RegistrationStatus.CONFIRMED);
        int attendedEvents = (int) registrationRepository.countByStudentIdAndStatus(userId, RegistrationStatus.ATTENDED);

        return DashboardStatsDTO.builder()
                .availableEvents(availableEvents)
                .myRegistrations(myRegistrations)
                .attendedEvents(attendedEvents)
                .build();
    }

    private EventDTO convertEventToDTO(Event event) {
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
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH);
                return eventDate.format(formatter);
        }

        private String formatEventTime(LocalTime eventTime) {
                if (eventTime == null) {
                        return null;
                }
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);
                return eventTime.format(formatter);
        }

    private RegistrationDTO convertRegistrationToDTO(Registration registration) {
        String requestedAtString = formatRequestedAt(registration.getRequestedAt());

        return RegistrationDTO.builder()
                .eventId(registration.getEvent().getId())
                .status(registration.getStatus().getValue())
                .requestedAt(requestedAtString)
                .build();
    }

    private RegistrationDetailDTO convertRegistrationToDetailDTO(Registration registration) {
        String requestedAtString = formatRequestedAt(registration.getRequestedAt());

        return RegistrationDetailDTO.builder()
                .eventId(registration.getEvent().getId())
                .event(convertEventToDTO(registration.getEvent()))
                .status(registration.getStatus().getValue())
                .requestedAt(requestedAtString)
                .build();
    }

    private String formatRequestedAt(LocalDateTime requestedAt) {
        if (requestedAt == null) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        return requestedAt.format(formatter);
    }
}
