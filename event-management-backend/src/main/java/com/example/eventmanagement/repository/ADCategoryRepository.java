package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.ADEventCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ADCategoryRepository extends JpaRepository<ADEventCategory,Integer> {
    long countByCategoryId(Integer categoryId);
}
