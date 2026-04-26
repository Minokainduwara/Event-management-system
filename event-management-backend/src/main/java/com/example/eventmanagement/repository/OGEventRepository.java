package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.OGEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface OGEventRepository extends JpaRepository<OGEvent, Integer> {
    List<OGEvent> findByEventTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String keyword1, String keyword2);
    List<OGEvent> findByCategoryId(int categoryId);
    
    @Query("SELECT c.categoryName as categoryName, COUNT(e) as eventCount " +
           "FROM OGCategory c LEFT JOIN OGEvent e ON c.categoryId = e.categoryId " +
           "GROUP BY c.categoryId, c.categoryName")
    List<Map<String, Object>> getCategoryCounts();
}
