package com.fivebits.fivebits_backend.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    private String paymentID;

    private double amount;
    private String method;
    private String status;
    private Date paymentDate;

    public Payment() {}

    public Payment(String paymentID, double amount, String method) {
        this.paymentID = paymentID;
        this.amount = amount;
        this.method = method;
        this.status = "Created";
        this.paymentDate = new Date();
    }

    // Methods

    public void processPayment() {
        this.status = "Processing";
    }

    public void markSuccessful() {
        this.status = "Successful";
        this.paymentDate = new Date();
    }

    public void markFailed() {
        this.status = "Failed";
    }

    public void generateReceipt() {
        this.status = "ReceiptGenerated";
    }

    // Getters and Setters

    public String getPaymentID() { return paymentID; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getPaymentDate() { return paymentDate; }
}
