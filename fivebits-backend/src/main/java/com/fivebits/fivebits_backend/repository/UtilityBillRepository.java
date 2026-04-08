package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.UtilityBill;

import java.util.List;

public interface UtilityBillRepository extends JpaRepository<UtilityBill, Long> {

    List<UtilityBill> findByStudentId(Long studentId);

    List<UtilityBill> findByPlaceId(Long placeId);

    List<UtilityBill> findByPlaceOwnerId(Long ownerId);
}
