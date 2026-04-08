package com.fivebits.fivebits_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private BoardingPlace place;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private double amount;
    private String method;
    private String type;  // BOARDING_FEE, UTILITY_BILL

    @Column(nullable = false)
    private String status;

    private String transactionRef;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "CREATED";
    }

    // Domain methods matching the state diagram
    public void processPayment() {
        this.status = "PROCESSING";
    }

    public void markSuccessful() {
        this.status = "SUCCESSFUL";
        this.paidAt = LocalDateTime.now();
    }

    public void markFailed() {
        this.status = "FAILED";
    }

    public void generateReceipt() {
        this.status = "RECEIPT_GENERATED";
    }
}
