package com.fivebits.fivebits_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    private Long id;
    private Long placeId;
    private String placeName;
    private Long studentId;
    private String studentName;
    private double offeredPrice;
    private double originalPrice;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;
}
