package com.fivebits.fivebits_backend.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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

    private Double latitude;
    private Double longitude;

    /**
     * Stores facilities as a list of strings for each boarding place.
     * Example values: "facility 01", "facility 02", "WiFi", "Parking", etc.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "boarding_place_facilities",
            joinColumns = @JoinColumn(name = "placeID", referencedColumnName = "placeID")
    )
    @Column(name = "facility")
    private Set<String> facilities = new HashSet<>();

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

    public void addFacility(String facility) {
        if (facility != null && !facility.isBlank()) {
            this.facilities.add(facility);
        }
    }

    public void removeFacility(String facility) {
        if (facility != null) {
            this.facilities.remove(facility);
        }
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

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Set<String> getFacilities() { return facilities; }
    public void setFacilities(Set<String> facilities) {
        this.facilities = (facilities == null) ? new HashSet<>() : facilities;
    }
}
