package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.ADUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ADUserRepository extends JpaRepository<ADUser,Integer> {
    // ✅ Get users by role (ADMIN / STUDENT / FACULTY)
    List<ADUser> findByRole(ADUser.Role role);

    // ✅ Filter by department
    List<ADUser> findByDepartment(String department);

    // ✅ Search by name OR university ID (case-insensitive)
    List<ADUser> findByNameContainingIgnoreCaseOrUniversityIdContainingIgnoreCase(
            String name,
            String universityId // 🔴 FIX: renamed for clarity (was university_id)
    );

    // ✅ Count users by role
    long countByRole(ADUser.Role role);

    // 🔴 FIX (IMPORTANT): login lookup
    Optional<ADUser> findByEmail(String email);

}
