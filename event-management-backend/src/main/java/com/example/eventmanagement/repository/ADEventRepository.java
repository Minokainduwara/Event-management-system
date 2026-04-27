package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.ADEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ADEventRepository extends JpaRepository<ADEvent,Integer> {

    List<ADEvent> findByEventTitleContainingIgnoreCase(String name);
    List<ADEvent> findByCategory_CategoryId(int categoryId);

    int countByCategoryCategoryId(int categoryId);
    @Query("""
        SELECT e.category.categoryName AS category,
               COUNT(e) AS count
        FROM ADEvent e
        GROUP BY e.category.categoryName
    """)
    List<CategoryCount> countEventsByCategory();

    List<ADEvent> findTop6ByOrderByEventDateDesc();
}
