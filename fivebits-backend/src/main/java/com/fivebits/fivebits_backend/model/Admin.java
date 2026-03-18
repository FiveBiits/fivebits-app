package com.fivebits.fivebits_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    private String adminID;

    private String name;
    private String email;
    private String password;
    private Date createdDate;

    public Admin() {}

    public Admin(String adminID, String name, String email, String password) {
        this.adminID = adminID;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdDate = new Date();
    }

    // Methods

    public void updateProfile(String name) {
        this.name = name;
    }

    public void resetPassword(String newPassword) {
        this.password = newPassword;
    }

    // Getters and Setters

    public String getAdminID() { return adminID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Date getCreatedDate() { return createdDate; }
}