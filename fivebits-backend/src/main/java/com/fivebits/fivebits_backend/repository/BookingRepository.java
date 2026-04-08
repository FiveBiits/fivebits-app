package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.Booking;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStudentId(Long studentId);

    List<Booking> findByPlaceId(Long placeId);

    List<Booking> findByPlaceOwnerId(Long ownerId);

    List<Booking> findByStudentIdAndStatus(Long studentId, String status);

    long countByPlaceOwnerIdAndStatus(Long ownerId, String status);
}
