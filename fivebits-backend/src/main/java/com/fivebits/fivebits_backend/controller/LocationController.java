package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.dto.CoordinatesRequest;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import com.fivebits.fivebits_backend.service.DistanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/boarding-places")
public class LocationController {

    private final BoardingPlaceRepository boardingPlaceRepository;
    private final DistanceService distanceService;

    public LocationController(BoardingPlaceRepository boardingPlaceRepository,
                              DistanceService distanceService) {
        this.boardingPlaceRepository = boardingPlaceRepository;
        this.distanceService = distanceService;
    }

    @PutMapping("/{placeId}/location")
    public ResponseEntity<?> updateLocation(@PathVariable String placeId,
                                           @Valid @RequestBody CoordinatesRequest request) {

        BoardingPlace place = boardingPlaceRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("Boarding place not found: " + placeId));

        place.setLatitude(request.getLatitude());
        place.setLongitude(request.getLongitude());
        boardingPlaceRepository.save(place);

        return ResponseEntity.ok(Map.of(
                "placeId", place.getPlaceID(),
                "latitude", place.getLatitude(),
                "longitude", place.getLongitude(),
                "message", "Location updated successfully"
        ));
    }

    @GetMapping("/{placeId}/distance-to-university")
    public ResponseEntity<?> getDistanceToUniversity(@PathVariable String placeId) {

        BoardingPlace place = boardingPlaceRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("Boarding place not found: " + placeId));

        if (place.getLatitude() == null || place.getLongitude() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Coordinates not set. Please update boarding place location (latitude/longitude) first."
            ));
        }

        double distanceKm = distanceService.distanceKmToUniversity(place.getLatitude(), place.getLongitude());

        return ResponseEntity.ok(Map.of(
                "placeId", place.getPlaceID(),
                "distanceKm", distanceKm,
                "distanceType", "STRAIGHT_LINE_HAVERSINE"
        ));
    }
}