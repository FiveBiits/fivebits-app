package com.fivebits.fivebits_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    private String notificationID;

    private String userID;   // can be student / owner / admin
    private String message;
    private String type;     // Booking, Payment, Issue
    private String status;   // Unread / Read
    private Date createdDate;

    public Notification() {}

    public Notification(String notificationID, String userID, String message, String type) {
        this.notificationID = notificationID;
        this.userID = userID;
        this.message = message;
        this.type = type;
        this.status = "Unread";
        this.createdDate = new Date();
    }

    // Methods

    public void markAsRead() {
        this.status = "Read";
    }

    // Getters and Setters

    public String getNotificationID() { return notificationID; }

    public String getUserID() { return userID; }
    public void setUserID(String userID) { this.userID = userID; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedDate() { return createdDate; }
}
