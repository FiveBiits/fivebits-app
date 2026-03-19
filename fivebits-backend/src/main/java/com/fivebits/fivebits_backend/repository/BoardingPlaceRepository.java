package com.fivebits.fivebits_backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fivebits.fivebits_backend.model.BoardingPlace;

public interface BoardingPlaceRepository extends JpaRepository<BoardingPlace, String> {
    // Custom search (very useful for your system)
    List<BoardingPlace> findByLocation(String location);

    List<BoardingPlace> findByPriceLessThanEqual(double price);

    List<BoardingPlace> findByPriceBetween(double minPrice, double maxPrice);

    List<BoardingPlace> findByPlaceIDInAndPriceBetween(Collection<String> placeIDs,
                                                       double minPrice,
                                                       double maxPrice);

    @Query(value = """
            SELECT bp.*
            FROM boarding_places bp
            JOIN boarding_place_facilities bpf ON bp.placeID = bpf.placeID
            WHERE bp.price BETWEEN :minPrice AND :maxPrice
              AND bpf.facility IN (:facilities)
            GROUP BY bp.placeID
            HAVING COUNT(DISTINCT bpf.facility) = :facilityCount
            """, nativeQuery = true)
    List<BoardingPlace> findByPriceBetweenAndHavingAllFacilities(
            @Param("minPrice") double minPrice,
            @Param("maxPrice") double maxPrice,
            @Param("facilities") List<String> facilities,
            @Param("facilityCount") long facilityCount
    );
}
