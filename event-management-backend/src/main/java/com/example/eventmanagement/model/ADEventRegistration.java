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

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;
    private String status;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private ADUser user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "event_id")
    private ADEvent event;
    @JsonProperty("studentName")
    public String getStudentName() {
        return user != null ? user.getName() : null;
    }
    @JsonProperty("universityId")
    public String getUniversityId() {
        return user != null ? user.getUniversityId() : null;
    }

    @JsonProperty("email")
    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }

    @JsonProperty("eventName")
    public String getEventName() {
        return event != null ? event.getEventTitle() : null;
    }

    @JsonProperty("eventDate")
    public LocalDateTime getEventDate() {
        return event != null ? event.getEventDate() : null;
    }

    @JsonProperty("event_name")
    public String getEventNameSnakeCase() {
        return getEventName();
    }

    @JsonProperty("event_date")
    public LocalDateTime getEventDateSnakeCase() {
        return getEventDate();
    }

    @JsonProperty("location")
    public String getLocation() {
        return event != null ? event.getLocation() : null;
    }

    @JsonProperty("category")
    public String getCategory() {
        return (event != null && event.getCategory() != null) ? event.getCategory().getCategoryName() : null;
    }

    @JsonProperty("event_time")
    public java.time.LocalTime getEventTime() {
        return event != null ? event.getEventTime() : null;
    }

    @JsonProperty("event_id")
    public Integer getEventId() {
        return event != null ? event.getEventId() : null;
    }
    public int getRegistration_id() {
        return registration_id;
    }

    public void setRegistration_id(int registration_id) {
        this.registration_id = registration_id;
    }

    public ADUser getUser() {
        return user;
    }

    public void setUser(ADUser ADUser) {
        this.user = ADUser;
    }

    public ADEvent getEvent() {
        return event;
    }

    public void setEvent(ADEvent event) {
        this.event = event;
    }

    public LocalDateTime getRegistration_date() {
        return registrationDate;
    }

    public void setRegistration_date(LocalDateTime registration_date) {
        this.registrationDate = registration_date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
