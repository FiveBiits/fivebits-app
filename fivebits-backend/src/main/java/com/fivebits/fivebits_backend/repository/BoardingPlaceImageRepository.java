package com.fivebits.fivebits_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.BoardingPlaceImage;

public interface BoardingPlaceImageRepository extends JpaRepository<BoardingPlaceImage, Long> {
    List<BoardingPlaceImage> findByPlaceIdOrderByDisplayOrder(Long placeId);
    long countByPlaceId(Long placeId);
}
