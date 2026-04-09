package com.fivebits.fivebits_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStudentId(Long studentId);

    List<Booking> findByPlaceId(Long placeId);

    List<Booking> findByPlaceOwnerId(Long ownerId);

    List<Booking> findByStudentIdAndStatus(Long studentId, String status);

    long countByPlaceOwnerIdAndStatus(Long ownerId, String status);

    boolean existsByStudentIdAndPlaceIdAndStatusIn(Long studentId, Long placeId, List<String> statuses);
}
