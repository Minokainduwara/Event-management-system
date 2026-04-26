package com.example.eventmanagement.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.example.eventmanagement.entity.OGEvent.Status;

public class OGCreateEventDto {
    @JsonProperty("event_title")
    private String eventTitle;

    private String description;

    @JsonProperty("event_date")
    private LocalDate eventDate;

    @JsonProperty("event_time")
    private LocalTime eventTime;

    private String location;

    @JsonProperty("max_participants")
    private int maxParticipants;

    private Status status;
    private String image;

    @JsonProperty("category_id")
    private int categoryId;

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public LocalTime getEventTime() { return eventTime; }
    public void setEventTime(LocalTime eventTime) { this.eventTime = eventTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public int getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(int maxParticipants) { this.maxParticipants = maxParticipants; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
}
