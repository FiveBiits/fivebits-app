package com.fivebits.fivebits_backend.dto;

import java.util.ArrayList;
import java.util.List;

import com.fivebits.fivebits_backend.model.BoardingPlace;

public class SearchCriteriaRequest {

    private Double minPrice = 0.0;
    private Double maxPrice = 100000.0;
    private Double maxDistance = 10.0;
    private List<String> facilities = new ArrayList<>();

    public SearchCriteriaRequest() {}

    public Double getMinPrice() { return minPrice; }
    public Double getMaxPrice() { return maxPrice; }
    public Double getMaxDistance() { return maxDistance; }
    public List<String> getFacilities() { return facilities; }

    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }
    public void setMaxDistance(Double maxDistance) { this.maxDistance = maxDistance; }
    public void setFacilities(List<String> facilities) { this.facilities = facilities; }

    public double effectiveMinPrice() { return minPrice == null ? 0.0 : minPrice; }
    public double effectiveMaxPrice() { return maxPrice == null ? 100000.0 : maxPrice; }
    public double effectiveMaxDistance() { return maxDistance == null ? 10.0 : maxDistance; }
    public List<String> effectiveFacilities() { return facilities == null ? List.of() : facilities; }

    public boolean booleanMatches(BoardingPlace place) {
        if (place == null) return false;

        double min = effectiveMinPrice();
        double max = effectiveMaxPrice();

        return place.getPrice() >= min && place.getPrice() <= max;
    }

    public boolean booleanMatches(BoardingPlace place, double distanceKm, List<String> placeFacilities) {
        if (!booleanMatches(place)) return false;

        if (distanceKm > effectiveMaxDistance()) return false;

        List<String> requested = effectiveFacilities();
        if (requested.isEmpty()) return true; 

        if (placeFacilities == null || placeFacilities.isEmpty()) return false;

        for (String f : requested) {
            if (f == null || f.isBlank()) continue;
            if (!placeFacilities.contains(f)) return false;
        }
        return true;
    }
}