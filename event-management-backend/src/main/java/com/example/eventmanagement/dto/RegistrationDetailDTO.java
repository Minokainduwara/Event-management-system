package com.example.eventmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDetailDTO {
    private Long eventId;
    private EventDTO event;
    private String status;
    private String requestedAt;
}
