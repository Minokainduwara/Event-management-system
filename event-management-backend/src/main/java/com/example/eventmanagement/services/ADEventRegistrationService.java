package com.example.eventmanagement.services;

import com.example.eventmanagement.model.*;
import com.example.eventmanagement.repository.ADEventRegistrationRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class ADEventRegistrationService {
    @Autowired
    private ADEventRegistrationRepository ADEventRegistrationRepository;

    @Autowired
    private ADUserRepository ADUserRepository;

    @Autowired
    private ADEventRepository ADEventRepository;

    public List<ADEventRegistration> getAllRegistrations(){

        return  ADEventRegistrationRepository.findAll();
    }

public ADRegistrationSummary getRegistrationSummary()
{

    ADRegistrationSummary ADRegistrationSummary =new ADRegistrationSummary();
    ADRegistrationSummary.setTotal(ADEventRegistrationRepository.count());
    ADRegistrationSummary.setConfirmed(ADEventRegistrationRepository.countByStatus("confirmed"));
    ADRegistrationSummary.setAttended(ADEventRegistrationRepository.countByStatus("attended"));
    ADRegistrationSummary.setPending(ADEventRegistrationRepository.countByStatus("pending"));
    ADRegistrationSummary.setCancelled(ADEventRegistrationRepository.countByStatus("cancelled"));
    return ADRegistrationSummary;
}
public List<ADEventRegistration> searchRegisteredStudent(String keyword)
{
    return ADEventRegistrationRepository.findByUser_NameContainingIgnoreCaseOrUser_UniversityIdContainingIgnoreCase(keyword,keyword);




}
    public List<ADEventRegistration> searchRegisteredStudents(String status) {

        return  ADEventRegistrationRepository.findByStatus( status);


    }


    public ADEventRegistration updateStatus(int id, String status) {
        ADEventRegistration ADEventRegistration = ADEventRegistrationRepository.findById(id).orElse(null);
        if (ADEventRegistration != null)
        {
            ADEventRegistration.setStatus(status);
            return ADEventRegistrationRepository.save(ADEventRegistration);
        }
        return null ;
    }

    public void deleteRegistration(int id) {
        ADEventRegistrationRepository.deleteById(id);
    }
    public int getConfirmedCount(int eventId) {
        return ADEventRegistrationRepository
                .countByEvent_EventIdAndStatus(eventId, "confirmed");
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
            String lowerKeyword = keyword.toLowerCase();
            registrations = registrations.stream()
                    .filter(reg -> 
                        (reg.getEventName() != null && reg.getEventName().toLowerCase().contains(lowerKeyword)) ||
                        (reg.getLocation() != null && reg.getLocation().toLowerCase().contains(lowerKeyword)) ||
                        (reg.getCategory() != null && reg.getCategory().toLowerCase().contains(lowerKeyword))
                    )
                    .collect(Collectors.toList());
        }

        return registrations;
    }

    public Map<String, Long> getMyRegistrationStats(String email) {
        Map<String, Long> stats = new HashMap<>();
        
        long totalRegistrations = ADEventRegistrationRepository.countByUser_Email(email);
        long confirmed = ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "confirmed");
        long pending = ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "pending");
        long attended = ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "attended");
        long cancelled = ADEventRegistrationRepository.countByUser_EmailAndStatus(email, "cancelled");

        stats.put("totalRegistrations", totalRegistrations);
        stats.put("confirmed", confirmed);
        stats.put("pending", pending);
        stats.put("attended", attended);
        stats.put("cancelled", cancelled);

        return stats;
    }
}
