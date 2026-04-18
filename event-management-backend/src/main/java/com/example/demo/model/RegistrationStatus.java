package com.example.demo.model;

public enum RegistrationStatus {
    PENDING("pending"),
    CONFIRMED("confirmed"),
    ATTENDED("attended");

    private final String value;

    RegistrationStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
