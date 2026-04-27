package com.example.eventmanagement.dto;


public class CategoryCountDTO {

    private String category;
    private long count;

    public CategoryCountDTO(String category, long count) {
        this.category = category;
        this.count = count;
    }

    public String getCategory() { return category; }
    public long getCount() { return count; }
}