package com.fivebits.fivebits_backend.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Data
@MappedSuperclass // This tells JPA this is a parent class, not a standalone table
public abstract class Bill {
    @Id
    protected String billID;
    protected double amount;
    protected LocalDate dueDate;
    protected boolean isPaid;

    protected double boardingFee;

    protected String placeID;
    protected String studentID;

    /** UML: markAsPaid() */
    public void markAsPaid() {
        this.isPaid = true;
    }

    //total = boardingFee + utilityPart
    protected void setTotalAmount(double utilityPart) {
        this.amount = this.boardingFee + utilityPart;
    }
    
    /** UML: generateBill() (child must implement) */
    public abstract void generateBill();

    /** Auto-generate billID + default dueDate, and ensure amount is calculated before save */
    @PrePersist
    protected void prePersist() {
        if (this.billID == null || this.billID.isBlank()) {
            this.billID = "BILL-" + UUID.randomUUID();
        }
        if (this.dueDate == null) {
            this.dueDate = LocalDate.now().plusDays(30);
        }
        // ensure amount is calculated
        generateBill();
    }
}