package com.fivebits.fivebits_backend.service;

import com.fivebits.fivebits_backend.model.BoardingPlace;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DistanceService implements DistanceCalculator {

    @Value("${app.university.latitude}")
    private double uniLat;

    @Value("${app.university.longitude}")
    private double uniLng;

    public double distanceKmToUniversity(double placeLat, double placeLng) {
        return haversineKm(placeLat, placeLng, uniLat, uniLng);
    }

    @Override
    public double distanceFromUniversityKm(BoardingPlace place) {
        if (place == null || place.getLatitude() == null || place.getLongitude() == null) {
            return Double.POSITIVE_INFINITY;
        }
        return distanceKmToUniversity(place.getLatitude(), place.getLongitude());
    }
    
    // Straight-line distance (Haversine)
    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    }
}