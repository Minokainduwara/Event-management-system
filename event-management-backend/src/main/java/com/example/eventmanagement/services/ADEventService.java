package com.example.eventmanagement.services;

import com.example.eventmanagement.ADenum.EventStatus;
import com.example.eventmanagement.dto.CategoryCountDTO;
import com.example.eventmanagement.model.ADEvent;
import com.example.eventmanagement.model.ADEventCategory;
import com.example.eventmanagement.repository.ADCategoryRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import com.example.eventmanagement.repository.CategoryCount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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


    public ADEvent createEvent(ADEvent event) {

        event.setStatus(EventStatus.UPCOMING);

        return ADEventRepository.save(event);
    }
    public ADEvent updateStatus(int id, EventStatus status) {

        ADEvent event = ADEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus(status);

        return ADEventRepository.save(event);
    }
    public List<CategoryCountDTO> getCategoryCounts() {

        return ADEventRepository.countEventsByCategory()
                .stream()
                .map(obj -> new CategoryCountDTO(
                        obj.getCategory(),
                        obj.getCount()
                ))
                .toList();
    }

}
