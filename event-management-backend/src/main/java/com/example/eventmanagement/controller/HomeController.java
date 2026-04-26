package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.ADEvent;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADAnnouncementRepository;
import com.example.eventmanagement.repository.ADCategoryRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private ADEventRepository eventRepository;

    @Autowired
    private ADUserRepository userRepository;

    @Autowired
    private ADCategoryRepository categoryRepository;

    @Autowired
    private ADAnnouncementRepository announcementRepository;

    /**
     * GET /home/stats
     * Returns platform-wide summary numbers for the home page.
     */
    @GetMapping("/stats")
    public Map<String, Long> getHomeStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalEvents",        eventRepository.count());
        stats.put("totalStudents",      userRepository.countByRole(ADUser.Role.STUDENT));
        stats.put("totalCategories",    categoryRepository.count());
        stats.put("totalAnnouncements", announcementRepository.count());
        return stats;
    }

    /**
     * GET /home/featured-events
     * Returns the 6 most recent / upcoming events for the home page cards.
     * Adjust the query method name to match your repository.
     */
    @GetMapping("/featured-events")
    public List<ADEvent> getFeaturedEvents() {
        // Returns all events sorted by eventDate descending, limited to 6
        
        return eventRepository.findTop6ByOrderByEventDateDesc();

    }
}