package com.example.demo.services;

import com.example.demo.model.Event;
import com.example.demo.model.EventCategory;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public EventCategory createCategory(EventCategory eventCategory)
    {
        return categoryRepository.save(eventCategory);
    }
    public List<EventCategory> getAllCategory()
    {
        return  categoryRepository.findAll();
    }
    public EventCategory getCategoryById(Integer id ){
        return categoryRepository.findById(id).orElse(null);
    }
    public EventCategory updateCategory(Integer id ,EventCategory eventCategory){
        EventCategory c=categoryRepository.findById(id).orElse(null);
        if(c!=null){
            c.setCategory_name(eventCategory.getCategory_name());
            c.setDescription(eventCategory.getDescription());
            return categoryRepository.save(eventCategory);
        }
        return null;
    }
    public void deleteCategory(@PathVariable Integer id){
        if(!categoryRepository.existsById(id)){
            throw new RuntimeException("Category is not found with id:"+id);
        }
        categoryRepository.deleteById(id);
    }

}
