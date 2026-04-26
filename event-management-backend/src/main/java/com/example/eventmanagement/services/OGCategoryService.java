package com.example.eventmanagement.services;

import com.example.eventmanagement.model.OGCategory;
import com.example.eventmanagement.repository.OGCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OGCategoryService {

    @Autowired
    private OGCategoryRepository categoryRepository;

    public List<OGCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
}
