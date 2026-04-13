package com.fivebits.fivebits_backend.dto;

import lombok.Data;

@Data
public class BidRequest {
    private Long placeId;
    private Long studentId;
    private double offeredPrice;
}
