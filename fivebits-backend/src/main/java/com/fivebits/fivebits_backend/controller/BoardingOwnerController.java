package com.fivebits.fivebits_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fivebits.fivebits_backend.model.BoardingOwner;
import com.fivebits.fivebits_backend.repository.BoardingOwnerRepository;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "*")
public class BoardingOwnerController {

    private final BoardingOwnerRepository ownerRepository;

    public BoardingOwnerController(BoardingOwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    @GetMapping
    public List<BoardingOwner> getAllOwners() {
        return ownerRepository.findAll();
    }

    @PostMapping("/register")
    public BoardingOwner registerOwner(@RequestBody BoardingOwner owner) {
        return ownerRepository.save(owner);
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<BoardingOwner> updateOwner(
            @PathVariable Long id,
            @RequestBody BoardingOwner updatedOwner) {

        return ownerRepository.findById(id).map(owner -> {
            owner.setName(updatedOwner.getName());
            owner.setPhoneNumber(updatedOwner.getPhoneNumber());
            owner.setBusinessName(updatedOwner.getBusinessName());
            owner.setAddress(updatedOwner.getAddress());
            owner.setNicNumber(updatedOwner.getNicNumber());
            return ResponseEntity.ok(ownerRepository.save(owner));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOwner(@PathVariable Long id) {
        return ownerRepository.findById(id).map(owner -> {
            ownerRepository.delete(owner);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}