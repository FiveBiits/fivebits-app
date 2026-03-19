package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, String> {
}
