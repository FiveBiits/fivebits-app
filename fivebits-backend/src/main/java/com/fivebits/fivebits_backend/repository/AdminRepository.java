package com.fivebits.fivebits_backend.repository;

import com.fivebits.fivebits_backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, String> {
}