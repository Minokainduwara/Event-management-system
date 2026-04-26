package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.OGAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OGAnnouncementRepository extends JpaRepository<OGAnnouncement, Integer> {
}
