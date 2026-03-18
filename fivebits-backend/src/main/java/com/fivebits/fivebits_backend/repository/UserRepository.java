package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
