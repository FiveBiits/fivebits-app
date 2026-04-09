package com.fivebits.fivebits_backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "boarding_places")
@Data
@NoArgsConstructor
public class BoardingPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    private String address;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private double price;

    private int totalRooms;
    private int availableRooms;

    private String facilities;

    private double latitude;
    private double longitude;

    private double rating;

    private String imageUrl;

    private boolean verified;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private BoardingOwner owner;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardingPlaceImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.rating == 0) this.rating = 0.0;
    }

    // Domain methods
    public void reduceAvailableRooms() {
        if (availableRooms > 0) availableRooms--;
    }

    public void increaseAvailableRooms() {
        if (availableRooms < totalRooms) availableRooms++;
    }

    public double calculateDistance(double userLat, double userLon) {
        final double R = 6371.0;
        double lat1 = Math.toRadians(this.latitude);
        double lat2 = Math.toRadians(userLat);
        double dLat = Math.toRadians(userLat - this.latitude);
        double dLon = Math.toRadians(userLon - this.longitude);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public double calculateRankScore(double userLat, double userLon, double maxPrice) {
        double distance = calculateDistance(userLat, userLon);
        double distanceScore = Math.max(0, 100 - (distance * 10));
        double priceScore = maxPrice > 0 ? Math.max(0, 100 - ((price / maxPrice) * 100)) : 50;
        double ratingScore = rating * 20;
        return (distanceScore * 0.4) + (priceScore * 0.3) + (ratingScore * 0.3);
    }
}
