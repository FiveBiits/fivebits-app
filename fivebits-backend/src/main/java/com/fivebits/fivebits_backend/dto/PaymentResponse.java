package com.fivebits.fivebits_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long placeId;
    private String placeName;
    private Long bookingId;
    private double amount;
    private String method;
    private String type;
    private String status;
    private String transactionRef;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private String hash;
    private String merchantId;
    
    // STOP HERE. Do not add manual getters or setters.
    // Lombok's @Data handles them automatically in the background.
}