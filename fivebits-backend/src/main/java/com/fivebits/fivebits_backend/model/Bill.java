package com.fivebits.fivebits_backend.model;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import java.time.LocalDate;

@Data
@MappedSuperclass // This tells JPA this is a parent class, not a standalone table
public abstract class Bill {
    @Id
    protected String billID;
    protected double amount;
    protected LocalDate dueDate;
    protected boolean isPaid;

    public abstract void generateBill();
}