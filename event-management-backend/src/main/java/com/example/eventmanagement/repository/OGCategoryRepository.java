package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.OGCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OGCategoryRepository extends JpaRepository<OGCategory, Integer> {
}
