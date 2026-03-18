package com.fivebits.fivebits_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodStore {
    @Id
    private String storeID;
    private String name;
    private double latitude;
    private double longitude;

    public double calculateDistance(double userLat, double userLon) {
        // Simple distance logic for the discovery system
        return Math.sqrt(Math.pow(latitude - userLat, 2) + Math.pow(longitude - userLon, 2));
    }
}