package com.example.eventmanagement.services;

import com.example.eventmanagement.entity.OGRegistration;
import com.example.eventmanagement.repository.OGRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OGRegistrationService {

    @Autowired
    private OGRegistrationRepository registrationRepository;

    public List<OGRegistration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public List<OGRegistration> getRegistrationsByEventId(int eventId) {
        return registrationRepository.findByEvent_EventId(eventId);
    }

    public int getRegistrationCountByEventId(int eventId) {
        return registrationRepository.countByEvent_EventId(eventId);
    }

    public Map<String, Long> getRegistrationSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("total", registrationRepository.countTotalRegistrations());
        summary.put("confirmed", registrationRepository.countConfirmedRegistrations());
        summary.put("pending", registrationRepository.countPendingRegistrations());
        summary.put("cancelled", registrationRepository.countCancelledRegistrations());
        return summary;
    }

    public OGRegistration updateRegistrationStatus(int id, OGRegistration.Status status) {
        OGRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        registration.setStatus(status);
        return registrationRepository.save(registration);
    }

    public void deleteRegistration(int id) {
        registrationRepository.deleteById(id);
    }
}
