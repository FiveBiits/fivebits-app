package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.config.UniversityProperties;
import com.fivebits.fivebits_backend.dto.BoardingPlaceSearchResponse;
import com.fivebits.fivebits_backend.dto.SearchCriteriaRequest;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.model.Location;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/boarding-places")
public class BoardingPlaceSearchController {

    private final BoardingPlaceRepository boardingPlaceRepository;
    private final UniversityProperties universityProperties;

    public BoardingPlaceSearchController(BoardingPlaceRepository boardingPlaceRepository,
                                         UniversityProperties universityProperties) {
        this.boardingPlaceRepository = boardingPlaceRepository;
        this.universityProperties = universityProperties;
    }

    @PostMapping("/search")
    public List<BoardingPlaceSearchResponse> search(@RequestBody(required = false) SearchCriteriaRequest criteria) {
        if (criteria == null) criteria = new SearchCriteriaRequest();

        double minPrice = criteria.effectiveMinPrice();
        double maxPrice = criteria.effectiveMaxPrice();
        double maxDistance = criteria.effectiveMaxDistance();

        List<String> facilities = criteria.effectiveFacilities().stream()
                .filter(f -> f != null && !f.isBlank())
                .toList();

        Location universityLoc = new Location(universityProperties.latitude(), universityProperties.longitude());

        List<BoardingPlace> candidates;
        if (facilities.isEmpty()) {
            candidates = boardingPlaceRepository.findByPriceBetween(minPrice, maxPrice);
        } else {
            candidates = boardingPlaceRepository.findByPriceBetweenAndHavingAllFacilities(
                    minPrice, maxPrice, facilities, facilities.size()
            );
        }

        return candidates.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .map(p -> {
                    Location placeLoc = new Location(p.getLatitude(), p.getLongitude());
                    double distanceKm = universityLoc.calculateDistanceKm(placeLoc);
                    return new BoardingPlaceSearchResponse(p, distanceKm);
                })
                .filter(r -> r.getDistanceKm() <= maxDistance)
                .sorted(Comparator
                        .comparingDouble((BoardingPlaceSearchResponse r) -> r.getPlace().getPrice())
                        .thenComparingDouble(BoardingPlaceSearchResponse::getDistanceKm))
                .toList();
    }
}