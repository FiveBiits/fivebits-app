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

    @Query(value = "SELECT * FROM boarding_places bp WHERE (CAST(:location AS text) IS NULL OR LOWER(bp.location) LIKE LOWER(CONCAT('%', CAST(:location AS text), '%'))) AND (CAST(:maxPrice AS double precision) IS NULL OR bp.price <= CAST(:maxPrice AS double precision))", nativeQuery = true)
    List<BoardingPlace> searchPlaces(@Param("location") String location, @Param("maxPrice") Double maxPrice);
}
