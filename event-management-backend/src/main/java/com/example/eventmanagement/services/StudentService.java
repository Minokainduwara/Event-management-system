package com.example.eventmanagement.services;

import com.example.eventmanagement.dto.StudentDashboardDTO;
import com.example.eventmanagement.model.ADEvent;
import com.example.eventmanagement.model.ADEventRegistration;
import com.example.eventmanagement.repository.ADEventRegistrationRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import com.example.eventmanagement.repository.CategoryCount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {
    @Autowired
    private ADEventRepository eventRepo;

    @Autowired
    private ADEventRegistrationRepository regRepo;


    public List<ADEvent> getEvents() {
        return eventRepo.findAll();
    }
    public long getEventCount(int eventId) {
        return regRepo.countByEvent_EventIdAndStatus(eventId, "REGISTERED");
    }
    public List<ADEventRegistration> getMyEvents(int userId) {
        return regRepo.findByUser_UserId(userId);
    }
    public StudentDashboardDTO getDashboard(int userId) {

        StudentDashboardDTO dto = new StudentDashboardDTO();

        long totalEvents = eventRepo.count();
        long myRegs = regRepo.countByUser_UserIdAndStatus(userId, "REGISTERED");

        dto.setAvailableEvents(totalEvents);
        dto.setMyRegistrations(myRegs);
        dto.setAttendedEvents(0);
        dto.setUpcomingEvents(totalEvents);

        return dto;
    }

    public StudentDashboardDTO getDashboard(String email) {
        StudentDashboardDTO dto = new StudentDashboardDTO();

        long totalEvents = eventRepo.count();
        long myRegs = regRepo.countByUser_Email(email);
        long attendedEvents = regRepo.countByUser_EmailAndStatus(email, "attended");
        long upcomingEvents = regRepo.countByUser_EmailAndStatus(email, "confirmed");

        dto.setAvailableEvents(totalEvents);
        dto.setMyRegistrations(myRegs);
        dto.setAttendedEvents(attendedEvents);
        dto.setUpcomingEvents(upcomingEvents);

        return dto;
    }
    public List<ADEventRegistration> getStudentActivity(int userId) {
        return regRepo
                .findByUser_UserIdOrderByRegistrationDateDesc(userId);
    }
    public List<ADEvent> searchEvents(String keyword) {
        return eventRepo.findByEventTitleContainingIgnoreCase(keyword);
    }
    public List<ADEvent> filterEventsByCategory(int categoryId) {
        return eventRepo.findByCategory_CategoryId(categoryId);
    }

}
