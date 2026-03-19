package com.fivebits.fivebits_backend.repository;

import com.fivebits.fivebits_backend.model.BoardingPlace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardingPlaceRepository extends JpaRepository<BoardingPlace, String> {

    // Custom search (very useful for your system)
    List<BoardingPlace> findByLocation(String location);

    List<BoardingPlace> findByPriceLessThanEqual(double price);
}
