package com.fivebits.fivebits_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "userID")
public class Student extends User {

    private int studentID; 
    private String contactNumber; 

    public Student() {
        super();
    }

    // Methods 
    public void searchRoom() { System.out.println("Searching for available rooms..."); }
    public void bookRoom() { System.out.println("Initiating booking request..."); }
    public void viewBookingHistory() { System.out.println("Fetching previous bookings..."); }
    public void viewTopRecommendations() { System.out.println("Calculating top 5 recommendations..."); }
    public void payBill() { System.out.println("Processing bill payment..."); }
    public void reportIssue() { System.out.println("Submitting maintenance issue report..."); }

    @Override
    public void viewDashboard() {
        System.out.println("Displaying Student Dashboard: Recent Bookings & Recommended Places.");
    }

    // Getters and Setters 
    public int getStudentID() { return studentID; }
    public void setStudentID(int studentID) { this.studentID = studentID; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
