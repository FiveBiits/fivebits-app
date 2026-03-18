package com.fivebits.fivebits_backend.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    private String bookingID;

    private String studentID;
    private String placeID;

    private Date startDate;
    private String status;

    public Booking() {}

    public Booking(String bookingID, String studentID, String placeID) {
        this.bookingID = bookingID;
        this.studentID = studentID;
        this.placeID = placeID;
        this.startDate = new Date();
        this.status = "Requested";
    }

    // Methods

    public void confirmBooking() {
        this.status = "Confirmed";
    }

    public void cancelBooking() {
        this.status = "Cancelled";
    }

    public void completeBooking() {
        this.status = "Completed";
    }

    // Getters and Setters

    public String getBookingID() { return bookingID; }

    public String getStudentID() { return studentID; }
    public void setStudentID(String studentID) { this.studentID = studentID; }

    public String getPlaceID() { return placeID; }
    public void setPlaceID(String placeID) { this.placeID = placeID; }

    public Date getStartDate() { return startDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

