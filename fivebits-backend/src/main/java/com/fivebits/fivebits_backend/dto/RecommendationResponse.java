package com.fivebits.fivebits_backend.dto;

import com.fivebits.fivebits_backend.model.BoardingPlace;

public class RecommendationResponse {

    private BoardingPlace place;
    private double distanceKm;
    private double score;

    public RecommendationResponse() {
    }

    public RecommendationResponse(BoardingPlace place, double distanceKm, double score) {
        this.place = place;
        this.distanceKm = distanceKm;
        this.score = score;
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

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}