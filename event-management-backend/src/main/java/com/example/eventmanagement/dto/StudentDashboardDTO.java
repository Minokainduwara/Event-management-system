package com.example.eventmanagement.dto;

public class StudentDashboardDTO {
    private long availableEvents;
    private long myRegistrations;
    private long attendedEvents;
    private long upcomingEvents;

    public StudentDashboardDTO() {
    }

    public long getAvailableEvents() {
        return availableEvents;
    }

    public void setAvailableEvents(long availableEvents) {
        this.availableEvents = availableEvents;
    }

    public long getMyRegistrations() {
        return myRegistrations;
    }

    public void setMyRegistrations(long myRegistrations) {
        this.myRegistrations = myRegistrations;
    }

    public long getAttendedEvents() {
        return attendedEvents;
    }

    public void setAttendedEvents(long attendedEvents) {
        this.attendedEvents = attendedEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }
}
