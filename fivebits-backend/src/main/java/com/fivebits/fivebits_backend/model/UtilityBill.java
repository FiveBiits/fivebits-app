package com.fivebits.fivebits_backend.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true) // Required when using @Data with inheritance
public class UtilityBill extends Bill {
    private double electricityUnits;
    private double waterUnits;

    @Override
    public void generateBill() {
        // Logic from your FiveBits requirements
        // Example: 1 unit = 50 LKR
        this.amount = (electricityUnits + waterUnits) * 50.0;
    }
}