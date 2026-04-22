package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<EventCategory,Integer> {
    long countByCategoryId(Integer categoryId);
}
