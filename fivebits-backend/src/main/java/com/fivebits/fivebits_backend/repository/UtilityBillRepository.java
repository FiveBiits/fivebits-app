package com.fivebits.fivebits_backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fivebits.fivebits_backend.model.UtilityBill;

@Repository
public interface UtilityBillRepository extends JpaRepository<UtilityBill, String> {
}
