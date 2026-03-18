package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.model.BoardingOwner;
import com.fivebits.fivebits_backend.repository.BoardingOwnerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "*")
public class BoardingOwnerController {

    private final BoardingOwnerRepository ownerRepository;

    public BoardingOwnerController(BoardingOwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    // GET ALL OWNERS
    @GetMapping
    public List<BoardingOwner> getAllOwners() {
        return ownerRepository.findAll();
    }

    // REGISTER OWNER
    @PostMapping("/register")
    public BoardingOwner registerOwner(@RequestBody BoardingOwner owner) {
        return ownerRepository.save(owner);
    }

    // UPDATE PROFILE
    @PatchMapping("/{id}/update")
    public ResponseEntity<BoardingOwner> updateOwner(
            @PathVariable String id,
            @RequestBody BoardingOwner updatedOwner) {

        return ownerRepository.findById(id).map(owner -> {
            owner.updateProfile(updatedOwner.getName(), updatedOwner.getPhone());
            return ResponseEntity.ok(ownerRepository.save(owner));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE OWNER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOwner(@PathVariable String id) {
        return ownerRepository.findById(id).map(owner -> {
            ownerRepository.delete(owner);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
    

