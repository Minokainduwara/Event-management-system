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

    public List<EventRegistrationDTO> getAllRegistrations(){

        List<EventRegistration> list=eventRegistrationRepository.findAll();
        List<EventRegistrationDTO> dtoList=new ArrayList<>();

        for (EventRegistration er : list) {

            User user = userRepository.findById(er.getUser_id()).orElse(null);
            Event event = eventRepository.findById(er.getEvent_id()).orElse(null);

            EventRegistrationDTO dto =new EventRegistrationDTO();

            dto.setRegistrationId(er.getRegistration_id());
            dto.setRegistrationDate(er.getRegistration_date().toString());
            dto.setStatus(er.getStatus());

            if (user != null) {
                dto.setStudentName(user.getName());
                dto.setUniversityId(user.getUniversity_id());
                dto.setEmail(user.getEmail());
            }

            if (event != null) {
                dto.setEventName(event.getEvent_title());
                dto.setEventDate(event.getEvent_date().toString());
            }

            dtoList.add(dto);
        }

        return dtoList;
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
public List<EventRegistration> searchRegisteredStudent(Integer eventId,String keyword)
{
    return eventRegistrationRepository.findByEventIdAndNameContainingIgnoreCaseOrEventIdAndUniversityIdContainingIgnoreCase(eventId,keyword,eventId,keyword);
}
    public List<EventRegistration> searchRegisteredStudents(Long eventId, String keyword, String status) {
        return eventRegistrationRepository.findByEventIdAndStatusAndNameContainingIgnoreCaseOrEventIdAndStatusAndUniversityIdContainingIgnoreCase(eventId, status, keyword, eventId, status, keyword);
    }
}
