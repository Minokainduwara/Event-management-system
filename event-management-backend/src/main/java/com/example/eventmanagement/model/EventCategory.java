package com.example.eventmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "event_category")
public class EventCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;
    @Column(nullable = false,unique = true)
    private  String categoryName;
    private String description;
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp created_at;
    @UpdateTimestamp
    private Timestamp updated_at;
    @Transient
    private int eventCount;
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Event> events;
    public EventCategory() {
    }

    public EventCategory(Integer categoryId, String categoryName, String description, Timestamp created_at, Timestamp updated_at) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public int getEventCount() {
        return eventCount;
    }

    public void setEventCount(int eventCount) {
        this.eventCount = eventCount;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
    @JsonProperty("categoryName")
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }
}
