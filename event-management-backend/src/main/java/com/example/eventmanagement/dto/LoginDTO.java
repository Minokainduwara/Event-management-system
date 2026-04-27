package com.example.eventmanagement.dto;

public class LoginDTO {

    // Request fields
    private String email;
    private String password;

    // Response fields
    private Long id;
    private String name;
    private String role;
    private String token;
    private String universityId;

    public LoginDTO() {}

    // Constructor for REQUEST (login input)
    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Constructor for RESPONSE (login output)
    public LoginDTO(Long id, String email, String name, String role, String token, String universityId) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.token = token;
        this.universityId = universityId;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUniversityId() { return universityId; }
    public void setUniversityId(String universityId) { this.universityId = universityId; }
}