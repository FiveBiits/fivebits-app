package com.fivebits.fivebits_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fivebits.fivebits_backend.dto.RecommendationResponse;
import com.fivebits.fivebits_backend.service.RecommendationService;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/top5")
    public List<RecommendationResponse> getTop5Recommendations() {
        return recommendationService.getTop5Recommendations();
    }
}