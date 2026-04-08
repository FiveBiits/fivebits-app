package com.fivebits.fivebits_backend.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long studentId;
    private Long placeId;
    private Long bookingId;
    private double amount;
    private String method;
    private String type; // BOARDING_FEE, UTILITY_BILL
}
