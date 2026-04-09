package com.fivebits.fivebits_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversityResponse {
    private Long id;
    private String name;
    private double latitude;
    private double longitude;
}
