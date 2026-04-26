package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.OGUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OGUserRepository extends JpaRepository<OGUser, Integer> {
    Optional<OGUser> findByEmail(String email);
    Optional<OGUser> findByUniversityId(String universityId);
}
