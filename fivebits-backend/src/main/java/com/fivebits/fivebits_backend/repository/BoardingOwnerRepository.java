package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.BoardingOwner;

public interface BoardingOwnerRepository extends JpaRepository<BoardingOwner, String> {
}
