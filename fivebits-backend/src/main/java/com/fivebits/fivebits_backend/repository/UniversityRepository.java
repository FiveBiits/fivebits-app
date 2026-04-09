package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.University;

public interface UniversityRepository extends JpaRepository<University, Long> {
}
