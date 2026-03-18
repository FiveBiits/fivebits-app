package com.fivebits.fivebits_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "boarding_places")
public class BoardingPlace {

    @Id
    private String placeID;

    private String name;
    private String location;
    private double price;
    private String description;
    private int availableRooms;
    private Date createdDate;

    // Optional: link to owner (simple way)
    private String ownerID;

    public BoardingPlace() {}

    public BoardingPlace(String placeID, String name, String location, double price, int availableRooms, String ownerID) {
        this.placeID = placeID;
        this.name = name;
        this.location = location;
        this.price = price;
        this.availableRooms = availableRooms;
        this.ownerID = ownerID;
        this.createdDate = new Date();
    }

    // Methods

    public void updateDetails(String name, String location, double price, int availableRooms) {
        this.name = name;
        this.location = location;
        this.price = price;
        this.availableRooms = availableRooms;
    }

    public void reduceAvailableRooms() {
        if (availableRooms > 0) {
            availableRooms--;
        }
    }

    public void increaseAvailableRooms() {
        availableRooms++;
    }

    // Getters and Setters

    public String getPlaceID() { return placeID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(int availableRooms) { this.availableRooms = availableRooms; }

    public String getOwnerID() { return ownerID; }
    public void setOwnerID(String ownerID) { this.ownerID = ownerID; }

    public Date getCreatedDate() { return createdDate; }
}
