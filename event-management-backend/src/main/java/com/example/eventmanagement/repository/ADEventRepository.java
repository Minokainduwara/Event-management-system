package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.ADEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ADEventRepository extends JpaRepository<ADEvent,Integer> {

    List<ADEvent> findByEventTitleContainingIgnoreCase(String name);
    List<ADEvent> findByCategory_CategoryId(int categoryId);

    int countByCategoryCategoryId(int categoryId);
}
