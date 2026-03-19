package com.fivebits.fivebits_backend.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "boarding_owners")
public class BoardingOwner {

    @Id
    private String ownerID;

    private String name;
    private String email;
    private String phone;
    private String password;
    private Date registeredDate;

    public BoardingOwner() {}

    public BoardingOwner(String ownerID, String name, String email, String phone, String password) {
        this.ownerID = ownerID;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.registeredDate = new Date();
    }

    // Methods

    public void updateProfile(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    // Getters and Setters

    public String getOwnerID() { return ownerID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Date getRegisteredDate() { return registeredDate; }
}

