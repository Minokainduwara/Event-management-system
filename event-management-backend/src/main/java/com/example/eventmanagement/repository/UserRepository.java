package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Integer> {
    List<User> findByRole(User.Role role);
    List<User> findByDepartment(String department);
    List<User> findByNameContainingIgnoreCaseOrUniversityIdContainingIgnoreCase(String name,String university_id);
    long countByRole(User.Role role);
}
