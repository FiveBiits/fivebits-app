package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}