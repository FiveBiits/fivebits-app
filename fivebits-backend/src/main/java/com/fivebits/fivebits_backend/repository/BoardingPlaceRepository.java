package com.fivebits.fivebits_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fivebits.fivebits_backend.model.BoardingPlace;

public interface BoardingPlaceRepository extends JpaRepository<BoardingPlace, Long> {

    List<BoardingPlace> findByLocationContainingIgnoreCase(String location);

    List<BoardingPlace> findByPriceLessThanEqual(double price);

    List<BoardingPlace> findByOwnerId(Long ownerId);

    List<BoardingPlace> findByVerifiedTrue();

    List<BoardingPlace> findByAvailableRoomsGreaterThan(int rooms);

    @Query("SELECT bp FROM BoardingPlace bp WHERE bp.verified = true AND bp.availableRooms > 0 AND (:location IS NULL OR LOWER(bp.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND (:maxPrice IS NULL OR bp.price <= :maxPrice)")
    List<BoardingPlace> searchPlaces(@Param("location") String location, @Param("maxPrice") Double maxPrice);
}
