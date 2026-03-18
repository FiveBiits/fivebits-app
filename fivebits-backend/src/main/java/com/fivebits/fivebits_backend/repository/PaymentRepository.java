package com.fivebits.fivebits_backend.repository;

import com.fivebits.fivebits_backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {
}
