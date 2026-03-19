package com.fivebits.fivebits_backend.dto;

import com.fivebits.fivebits_backend.model.BoardingPlace;

public class BoardingPlaceSearchResponse {

    private BoardingPlace place;
    private double distanceKm;

    public BoardingPlaceSearchResponse() {
    }

    public BoardingPlaceSearchResponse(BoardingPlace place, double distanceKm) {
        this.place = place;
        this.distanceKm = distanceKm;
    }

    public BoardingPlace getPlace() {
        return place;
    }

    public void setPlace(BoardingPlace place) {
        this.place = place;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }
}