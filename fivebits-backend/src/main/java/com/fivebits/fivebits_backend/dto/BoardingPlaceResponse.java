package com.fivebits.fivebits_backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardingPlaceResponse {
    private Long id;
    private String name;
    private String location;
    private String address;
    private String description;
    private double price;
    private int totalRooms;
    private int availableRooms;
    private String facilities;
    private double latitude;
    private double longitude;
    private double rating;
    private String imageUrl;
    private List<ImageResponse> images;
    private boolean verified;
    private Long ownerId;
    private String ownerName;
    private String ownerPhone;
    private LocalDateTime createdAt;
    private Double distance;
    private Double rankScore;
    private String nearestUniversityName;
    private Double distanceToUniversity;
}
