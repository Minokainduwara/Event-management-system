package com.example.eventmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String category;
    private String date;
    private String time;
    private String location;
    private String organizer;
    private String description;
    private Integer seatsAvailable;
}
