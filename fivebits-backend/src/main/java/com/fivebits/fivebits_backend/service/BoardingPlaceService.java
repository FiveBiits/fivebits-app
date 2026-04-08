package com.fivebits.fivebits_backend.service;

import com.fivebits.fivebits_backend.dto.BoardingPlaceRequest;
import com.fivebits.fivebits_backend.dto.BoardingPlaceResponse;
import com.fivebits.fivebits_backend.model.BoardingOwner;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.repository.BoardingOwnerRepository;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardingPlaceService {

    private final BoardingPlaceRepository placeRepository;
    private final BoardingOwnerRepository ownerRepository;

    @Transactional
    public BoardingPlaceResponse createPlace(Long ownerId, BoardingPlaceRequest request) {
        BoardingOwner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        BoardingPlace place = new BoardingPlace();
        place.setName(request.getName());
        place.setLocation(request.getLocation());
        place.setAddress(request.getAddress());
        place.setDescription(request.getDescription());
        place.setPrice(request.getPrice());
        place.setTotalRooms(request.getTotalRooms());
        place.setAvailableRooms(request.getAvailableRooms());
        place.setFacilities(request.getFacilities());
        place.setLatitude(request.getLatitude());
        place.setLongitude(request.getLongitude());
        place.setImageUrl(request.getImageUrl());
        place.setOwner(owner);

        BoardingPlace saved = placeRepository.save(place);
        return toResponse(saved, null, null);
    }

    @Transactional
    public BoardingPlaceResponse updatePlace(Long placeId, BoardingPlaceRequest request) {
        BoardingPlace place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Boarding place not found"));

        if (request.getName() != null) place.setName(request.getName());
        if (request.getLocation() != null) place.setLocation(request.getLocation());
        if (request.getAddress() != null) place.setAddress(request.getAddress());
        if (request.getDescription() != null) place.setDescription(request.getDescription());
        if (request.getPrice() > 0) place.setPrice(request.getPrice());
        if (request.getTotalRooms() > 0) place.setTotalRooms(request.getTotalRooms());
        if (request.getAvailableRooms() >= 0) place.setAvailableRooms(request.getAvailableRooms());
        if (request.getFacilities() != null) place.setFacilities(request.getFacilities());
        if (request.getLatitude() != 0) place.setLatitude(request.getLatitude());
        if (request.getLongitude() != 0) place.setLongitude(request.getLongitude());
        if (request.getImageUrl() != null) place.setImageUrl(request.getImageUrl());

        BoardingPlace saved = placeRepository.save(place);
        return toResponse(saved, null, null);
    }

    public BoardingPlaceResponse getPlace(Long placeId) {
        BoardingPlace place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Boarding place not found"));
        return toResponse(place, null, null);
    }

    public List<BoardingPlaceResponse> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(p -> toResponse(p, null, null))
                .collect(Collectors.toList());
    }

    public List<BoardingPlaceResponse> getOwnerPlaces(Long ownerId) {
        return placeRepository.findByOwnerId(ownerId).stream()
                .map(p -> toResponse(p, null, null))
                .collect(Collectors.toList());
    }

    public List<BoardingPlaceResponse> searchPlaces(String location, Double maxPrice) {
        return placeRepository.searchPlaces(location, maxPrice).stream()
                .map(p -> toResponse(p, null, null))
                .collect(Collectors.toList());
    }

    public List<BoardingPlaceResponse> getRecommendations(double lat, double lng, Double maxPrice, int limit) {
        double effectiveMaxPrice = (maxPrice != null) ? maxPrice : 50000;
        List<BoardingPlace> all = placeRepository.findByAvailableRoomsGreaterThan(0);

        return all.stream()
                .map(p -> {
                    double distance = p.calculateDistance(lat, lng);
                    double rankScore = p.calculateRankScore(lat, lng, effectiveMaxPrice);
                    return toResponse(p, distance, rankScore);
                })
                .sorted((a, b) -> Double.compare(b.getRankScore(), a.getRankScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePlace(Long placeId) {
        placeRepository.deleteById(placeId);
    }

    @Transactional
    public BoardingPlaceResponse verifyPlace(Long placeId) {
        BoardingPlace place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Boarding place not found"));
        place.setVerified(true);
        return toResponse(placeRepository.save(place), null, null);
    }

    private BoardingPlaceResponse toResponse(BoardingPlace place, Double distance, Double rankScore) {
        BoardingPlaceResponse resp = new BoardingPlaceResponse();
        resp.setId(place.getId());
        resp.setName(place.getName());
        resp.setLocation(place.getLocation());
        resp.setAddress(place.getAddress());
        resp.setDescription(place.getDescription());
        resp.setPrice(place.getPrice());
        resp.setTotalRooms(place.getTotalRooms());
        resp.setAvailableRooms(place.getAvailableRooms());
        resp.setFacilities(place.getFacilities());
        resp.setLatitude(place.getLatitude());
        resp.setLongitude(place.getLongitude());
        resp.setRating(place.getRating());
        resp.setImageUrl(place.getImageUrl());
        resp.setVerified(place.isVerified());
        resp.setOwnerId(place.getOwner().getId());
        resp.setOwnerName(place.getOwner().getName());
        resp.setOwnerPhone(place.getOwner().getPhoneNumber());
        resp.setCreatedAt(place.getCreatedAt());
        resp.setDistance(distance);
        resp.setRankScore(rankScore);
        return resp;
    }
}
