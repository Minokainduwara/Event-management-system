package com.example.eventmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registration")
public class ADEventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int registration_id;

    private LocalDateTime registration_date;
    private String status;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private ADUser ADUser;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "event_id")
    private ADEvent event;
    @JsonProperty("studentName")
    public String getStudentName() {
        return ADUser != null ? ADUser.getName() : null;
    }
    @JsonProperty("universityId")
    public String getUniversityId() {
        return ADUser != null ? ADUser.getUniversityId() : null;
    }

    @JsonProperty("email")
    public String getEmail() {
        return ADUser != null ? ADUser.getEmail() : null;
    }

    @JsonProperty("eventName")
    public String getEventName() {
        return event != null ? event.getEventTitle() : null;
    }

    @JsonProperty("eventDate")
    public LocalDateTime getEventDate() {
        return event != null ? event.getEventDate() : null;
    }
    public int getRegistration_id() {
        return registration_id;
    }

    public void setRegistration_id(int registration_id) {
        this.registration_id = registration_id;
    }

    public ADUser getUser() {
        return ADUser;
    }

    public void setUser(ADUser ADUser) {
        this.ADUser = ADUser;
    }

    public ADEvent getEvent() {
        return event;
    }

    public void setEvent(ADEvent event) {
        this.event = event;
    }

    public LocalDateTime getRegistration_date() {
        return registration_date;
    }

    public void setRegistration_date(LocalDateTime registration_date) {
        this.registration_date = registration_date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
