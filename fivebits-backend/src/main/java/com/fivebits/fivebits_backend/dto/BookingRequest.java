package com.fivebits.fivebits_backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long studentId;
    private Long placeId;
    private LocalDate startDate;
    private LocalDate endDate;
}
