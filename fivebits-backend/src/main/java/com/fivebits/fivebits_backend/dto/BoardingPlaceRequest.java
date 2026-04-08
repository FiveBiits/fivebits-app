package com.fivebits.fivebits_backend.dto;

import lombok.Data;

@Data
public class BoardingPlaceRequest {
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
    private String imageUrl;
}
