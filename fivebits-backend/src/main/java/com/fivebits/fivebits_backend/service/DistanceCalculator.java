package com.fivebits.fivebits_backend.service;

import com.fivebits.fivebits_backend.model.BoardingPlace;

public interface DistanceCalculator {
    double distanceFromUniversityKm(BoardingPlace place);
}