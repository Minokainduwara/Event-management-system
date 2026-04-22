package com.example.eventmanagement.model;

public enum EventCategory {
    TECHNOLOGY("Technology"),
    SPORTS("Sports"),
    CULTURAL("Cultural"),
    CAREER("Career"),
    BUSINESS("Business"),
    SCIENCE("Science");

    private final String displayName;

    EventCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
