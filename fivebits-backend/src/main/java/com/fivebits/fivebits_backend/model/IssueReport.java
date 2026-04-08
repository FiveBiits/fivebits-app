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
@Table(name = "issue_reports")
@Data
@NoArgsConstructor
public class IssueReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private BoardingPlace place;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    private String reply;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "SUBMITTED";
    }

    // Domain methods matching the state diagram
    public void assignToOwner() {
        this.status = "ASSIGNED";
    }

    public void startProgress() {
        this.status = "IN_PROGRESS";
    }

    public void resolve(String reply) {
        this.status = "RESOLVED";
        this.reply = reply;
        this.resolvedAt = LocalDateTime.now();
    }

    public void close() {
        this.status = "CLOSED";
    }

    public void reject(String reason) {
        this.status = "REJECTED";
        this.reply = reason;
    }
}