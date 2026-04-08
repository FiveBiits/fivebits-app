package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.dto.BoardingPlaceRequest;
import com.fivebits.fivebits_backend.dto.BoardingPlaceResponse;
import com.fivebits.fivebits_backend.service.BoardingPlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class BoardingPlaceController {

    private final BoardingPlaceService placeService;

    @GetMapping
    public List<BoardingPlaceResponse> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardingPlaceResponse> getPlace(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(placeService.getPlace(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPlace(@RequestParam Long ownerId, @RequestBody BoardingPlaceRequest request) {
        try {
            return ResponseEntity.ok(placeService.createPlace(ownerId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<?> updatePlace(@PathVariable Long id, @RequestBody BoardingPlaceRequest request) {
        try {
            return ResponseEntity.ok(placeService.updatePlace(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/owner/{ownerId}")
    public List<BoardingPlaceResponse> getOwnerPlaces(@PathVariable Long ownerId) {
        return placeService.getOwnerPlaces(ownerId);
    }

    @GetMapping("/search")
    public List<BoardingPlaceResponse> searchPlaces(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double maxPrice) {
        return placeService.searchPlaces(location, maxPrice);
    }

    @GetMapping("/recommendations")
    public List<BoardingPlaceResponse> getRecommendations(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "5") int limit) {
        return placeService.getRecommendations(lat, lng, maxPrice, limit);
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<BoardingPlaceResponse> verifyPlace(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.verifyPlace(id));
    }
}