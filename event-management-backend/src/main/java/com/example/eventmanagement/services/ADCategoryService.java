package com.example.eventmanagement.services;

import com.example.eventmanagement.model.ADEventCategory;
import com.example.eventmanagement.repository.ADCategoryRepository;
import com.example.eventmanagement.repository.ADEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class ADCategoryService {
    @Autowired
    private ADCategoryRepository ADCategoryRepository;
    @Autowired
    private ADEventRepository ADEventRepository;
    public ADEventCategory createCategory(ADEventCategory ADEventCategory)
    {
        return ADCategoryRepository.save(ADEventCategory);
    }
    public List<ADEventCategory> getAllCategory()
    {
        List<ADEventCategory> categories= ADCategoryRepository.findAll();
        for(ADEventCategory cat:categories){
            int count= ADEventRepository.countByCategoryCategoryId(cat.getCategoryId());
            cat.setEventCount(count);
        }
        return  ADCategoryRepository.findAll();
    }
    public ADEventCategory getCategoryById(Integer id ){
        return ADCategoryRepository.findById(id).orElse(null);
    }
    public ADEventCategory updateCategory(Integer id , ADEventCategory ADEventCategory){
        ADEventCategory c= ADCategoryRepository.findById(id).orElse(null);
        if(c!=null){
            c.setCategoryName(ADEventCategory.getCategoryName());
            c.setDescription(ADEventCategory.getDescription());
            return ADCategoryRepository.save(ADEventCategory);
        }
        return null;
    }
    public void deleteCategory(@PathVariable Integer id){
        if(!ADCategoryRepository.existsById(id)){
            throw new RuntimeException("Category is not found with id:"+id);
        }
        ADCategoryRepository.deleteById(id);
    }

}
