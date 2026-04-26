package com.example.eventmanagement.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registration")
public class OGRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("registration_id")
    @Column(name = "registration_id")
    private int registrationId;

    @JsonProperty("registration_date")
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private OGEvent event;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private OGUser user;

    public enum Status {
        PENDING, CONFIRMED, CANCELLED
    }

    public int getRegistrationId() { return registrationId; }
    public void setRegistrationId(int registrationId) { this.registrationId = registrationId; }
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public OGEvent getEvent() { return event; }
    public void setEvent(OGEvent event) { this.event = event; }
    public OGUser getUser() { return user; }
    public void setUser(OGUser user) { this.user = user; }
}
