package com.example.eventmanagement.services;

import com.example.eventmanagement.model.ADEvent;
import com.example.eventmanagement.model.ADEventCategory;
import com.example.eventmanagement.repository.ADCategoryRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ADEventService {
    @Autowired
    private ADEventRepository ADEventRepository;
    @Autowired
    private ADCategoryRepository ADCategoryRepository;

    public ADEvent saveEvent(ADEvent event){
        Integer categoryId = event.getCategory().getCategoryId();
        ADEventCategory category = ADCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        event.setCategory(category);
        return ADEventRepository.save(event);

    }
    public List<ADEvent> getAllEvent()
    {
        return ADEventRepository.findAll();
    }
    public ADEvent getEventById(int id)
    {
        return ADEventRepository.findById(id).orElse(null);
    }
    public void deleteEvent(int id){
        if(!ADEventRepository.existsById(id)){
            throw new RuntimeException("Event is not found with id:"+id);
        }

        ADEventRepository.deleteById(id);
    }
    public ADEvent updateEvent(int id, ADEvent event){
        ADEvent e= ADEventRepository.findById(id).orElse(null);

        if(e!=null)
        {
            e.setEventTitle(event.getEventTitle());
            e.setDescription(event.getDescription());
            e.setLocation(event.getLocation());
            e.setEventDate(event.getEventDate());
            e.setEventTime(event.getEventTime());
            e.setStatus(event.getStatus());
            e.setMaxParticipants(event.getMaxParticipants());
            e.setCategory(event.getCategory());
            e.setUser(event.getUser());

            return  ADEventRepository.save(e);
        }
        return  null;
    }

    public List<ADEvent> getEventByName(String keyword)
    {
        return ADEventRepository.findByEventTitleContainingIgnoreCase(keyword);
    }

    public List<ADEvent> getEventByCategory(Integer categoryId)
    {
        if(categoryId==null){
            return ADEventRepository.findAll();
        }
        return ADEventRepository.findByCategory_CategoryId(categoryId);
    }
    // In EventService.java
    public ADEvent updateEventStatus(Integer id, String status) {
        ADEvent event = getEventById(id);
        if (event == null) {
            return null;
        }
        event.setStatus(status);
        return saveEvent(event);
    }
}
