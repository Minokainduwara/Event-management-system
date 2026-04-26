package com.example.eventmanagement.model;


import com.example.eventmanagement.ADenum.EventStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "event")
public class ADEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int eventId;
    @Column(name = "event_title")
    private String eventTitle;
    private String description;
    private LocalDateTime eventDate;
    private LocalTime eventTime;
    private String location;
    @Column(nullable = true)
    private Integer maxParticipants;


    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    private String image;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private ADEventCategory category;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "created_by")

    private ADUser ADUser;
    @Enumerated(EnumType.STRING)
    private EventStatus status;
    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }



    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public ADEventCategory getCategory() {
        return category;
    }

    public void setCategory(ADEventCategory category) {
        this.category = category;
    }

    public ADUser getUser() {
        return ADUser;
    }

    public void setUser(ADUser ADUser) {
        this.ADUser = ADUser;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
}
