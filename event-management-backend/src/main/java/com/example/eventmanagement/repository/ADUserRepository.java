package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.ADUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ADUserRepository extends JpaRepository<ADUser,Integer> {
    List<ADUser> findByRole(ADUser.Role role);
    List<ADUser> findByDepartment(String department);
    List<ADUser> findByNameContainingIgnoreCaseOrUniversityIdContainingIgnoreCase(String name, String university_id);
    long countByRole(ADUser.Role role);

    Optional<ADUser> findByEmail(String email);
}
