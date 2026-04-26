package com.example.eventmanagement.model;

import com.example.eventmanagement.enums.Role;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class ADUser {

    // 🔴 FIX 1: primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    // 🔴 FIX 2: database column consistency (important for login & constraints)
    @Column(nullable = false, unique = true)
    private String universityId;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    // 🔴 FIX 3: role enum stored as STRING in DB
    @Enumerated(EnumType.STRING)
    private Role role;

    private String department;
    private String year;
    private String phone;

    // 🔴 FIX 4: auto timestamp handling
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 🔴 FIX 5: not stored in DB (calculated field)
    @Transient
    private int eventsRegistered;

//    public enum Role {
//        ADMIN,
//        STUDENT,
//        FACULTY
//    }

    public ADUser() {
    }

    // 🔴 FIX 6: removed created_at from constructor (handled automatically)
    public ADUser(int userId, String universityId, String name, String email,
                  String password, Role role, String department,
                  String year, String phone) {
        this.userId = userId;
        this.universityId = universityId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.year = year;
        this.phone = phone;
    }

    // 🔴 FIX 7: auto set createdAt before insert
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // GETTERS + SETTERS (unchanged but clean structure)

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUniversityId() {
        return universityId;
    }

    public void setUniversityId(String universityId) {
        this.universityId = universityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public int getEventsRegistered() {
        return eventsRegistered;
    }

    public void setEventsRegistered(int eventsRegistered) {
        this.eventsRegistered = eventsRegistered;
    }
}