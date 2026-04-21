package com.example.demo.repository;
import com.example.demo.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer>{


}
