package com.fivebits.fivebits_backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fivebits.fivebits_backend.model.Bid;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByPlaceIdOrderByCreatedAtDesc(Long placeId);

    List<Bid> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    Optional<Bid> findFirstByPlaceIdAndStudentIdAndStatusOrderByCreatedAtDesc(
        Long placeId, Long studentId, String status);

    List<Bid> findByStatusAndExpiresAtBefore(String status, LocalDateTime now);
}
