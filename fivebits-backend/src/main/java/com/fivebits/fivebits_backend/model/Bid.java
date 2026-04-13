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
@Table(name = "bids")
@Data
@NoArgsConstructor
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private BoardingPlace place;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private double offeredPrice;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED, WITHDRAWN, EXPIRED

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    // Domain methods
    public void accept() {
        this.status = "ACCEPTED";
        this.acceptedAt = LocalDateTime.now();
    }

    public void reject() {
        this.status = "REJECTED";
        this.rejectedAt = LocalDateTime.now();
    }

    public void withdraw() {
        this.status = "WITHDRAWN";
    }

    public boolean isExpired() {
        if (this.expiresAt == null) return false;
        return LocalDateTime.now().isAfter(this.expiresAt) && "PENDING".equals(this.status);
    }
}
