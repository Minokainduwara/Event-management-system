package com.example.demo.services;

import com.example.demo.model.*;
import com.example.demo.repository.EventRegistrationRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventRegistrationService {
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    public List<EventRegistration> getAllRegistrations(){

        return  eventRegistrationRepository.findAll();
    }

public RegistrationSummary getRegistrationSummary()
{

    RegistrationSummary registrationSummary=new RegistrationSummary();
    registrationSummary.setTotal(eventRegistrationRepository.count());
    registrationSummary.setConfirmed(eventRegistrationRepository.countByStatus("confirmed"));
    registrationSummary.setAttended(eventRegistrationRepository.countByStatus("attended"));
    registrationSummary.setPending(eventRegistrationRepository.countByStatus("pending"));
    registrationSummary.setCancelled(eventRegistrationRepository.countByStatus("cancelled"));
    return registrationSummary;
}
public List<EventRegistration> searchRegisteredStudent(String keyword)
{
    return eventRegistrationRepository.findByUser_NameContainingIgnoreCaseOrUser_UniversityIdContainingIgnoreCase(keyword,keyword);




}
    public List<EventRegistration> searchRegisteredStudents(String status) {

        return  eventRegistrationRepository.findByStatus( status);


    }


    public EventRegistration updateStatus(int id, String status) {
        EventRegistration eventRegistration=eventRegistrationRepository.findById(id).orElse(null);
        if (eventRegistration != null)
        {
            eventRegistration.setStatus(status);
            return eventRegistrationRepository.save(eventRegistration);
        }
        return null ;
    }

    public void deleteRegistration(int id) {
        eventRegistrationRepository.deleteById(id);
    }
    public int getConfirmedCount(int eventId) {
        return eventRegistrationRepository
                .countByEvent_EventIdAndStatus(eventId, "confirmed");
    }
}
