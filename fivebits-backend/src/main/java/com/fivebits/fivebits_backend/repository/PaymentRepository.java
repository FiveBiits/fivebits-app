package com.fivebits.fivebits_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentId(Long studentId);

    List<Payment> findByPlaceOwnerId(Long ownerId);

    List<Payment> findByBookingId(Long bookingId);

    List<Payment> findByStudentIdAndStatus(Long studentId, String status);
}
