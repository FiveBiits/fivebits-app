package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class BoardingPlaceController {

    private final BoardingPlaceRepository placeRepository;

    public BoardingPlaceController(BoardingPlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    // GET ALL PLACES
    @GetMapping
    public List<BoardingPlace> getAllPlaces() {
        return placeRepository.findAll();
    }

    // ADD NEW PLACE
    @PostMapping("/add")
    public BoardingPlace addPlace(@RequestBody BoardingPlace place) {
        return placeRepository.save(place);
    }

    // UPDATE PLACE
    @PatchMapping("/{id}/update")
    public ResponseEntity<BoardingPlace> updatePlace(
            @PathVariable String id,
            @RequestBody BoardingPlace updatedPlace) {

        return placeRepository.findById(id).map(place -> {
            place.updateDetails(
                    updatedPlace.getName(),
                    updatedPlace.getLocation(),
                    updatedPlace.getPrice(),
                    updatedPlace.getAvailableRooms()
            );
            return ResponseEntity.ok(placeRepository.save(place));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE PLACE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable String id) {
        return placeRepository.findById(id).map(place -> {
            placeRepository.delete(place);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // SEARCH BY LOCATION
    @GetMapping("/search/location")
    public List<BoardingPlace> searchByLocation(@RequestParam String location) {
        return placeRepository.findByLocation(location);
    }

    // SEARCH BY PRICE
    @GetMapping("/search/price")
    public List<BoardingPlace> searchByPrice(@RequestParam double maxPrice) {
        return placeRepository.findByPriceLessThanEqual(maxPrice);
    }
}