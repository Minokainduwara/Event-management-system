package com.example.eventmanagement.repository;

import com.example.eventmanagement.model.OGRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OGRegistrationRepository extends JpaRepository<OGRegistration, Integer> {
    List<OGRegistration> findByEvent_EventId(int eventId);
    int countByEvent_EventId(int eventId);
    
    @Query("SELECT COUNT(r) FROM OGRegistration r")
    long countTotalRegistrations();
    
    @Query("SELECT COUNT(r) FROM OGRegistration r WHERE r.status = 'CONFIRMED'")
    long countConfirmedRegistrations();
    
    @Query("SELECT COUNT(r) FROM OGRegistration r WHERE r.status = 'PENDING'")
    long countPendingRegistrations();
    
    @Query("SELECT COUNT(r) FROM OGRegistration r WHERE r.status = 'CANCELLED'")
    long countCancelledRegistrations();
}
