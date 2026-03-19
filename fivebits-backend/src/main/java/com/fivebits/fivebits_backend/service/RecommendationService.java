package com.fivebits.fivebits_backend.service;

import com.fivebits.fivebits_backend.dto.RecommendationResponse;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final BoardingPlaceRepository boardingPlaceRepository;
    private final DistanceCalculator distanceCalculator;

    private final int maxResults = 5;

    public RecommendationService(BoardingPlaceRepository boardingPlaceRepository,
                                 DistanceCalculator distanceCalculator) {
        this.boardingPlaceRepository = boardingPlaceRepository;
        this.distanceCalculator = distanceCalculator;
    }

    public List<RecommendationResponse> getTop5Recommendations() {
        List<BoardingPlace> places = boardingPlaceRepository.findAll();

        return places.stream()
                .filter(place -> place.getLatitude() != null && place.getLongitude() != null)
                .map(place -> {
                    double distanceKm = distanceCalculator.distanceFromUniversityKm(place);
                    double score = calculateScore(place, distanceKm);
                    return new RecommendationResponse(place, distanceKm, score);
                })
                .sorted(Comparator
                        .comparingDouble(RecommendationResponse::getScore)
                        .reversed())
                .limit(maxResults)
                .toList();
    }

    public double calculateScore(BoardingPlace place, double distanceKm) {
        double score = 0.0;

        double priceScore = Math.max(0, 50 - (place.getPrice() / 2000.0));
        score += priceScore;

        double distanceScore = Math.max(0, 50 - (distanceKm * 5));
        score += distanceScore;

        return score;
    }
}