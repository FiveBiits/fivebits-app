package com.fivebits.fivebits_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fivebits.fivebits_backend.model.User;
import com.fivebits.fivebits_backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows your frontend to connect later
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. GET ALL USERS (Fixes the Whitelabel error for /api/users)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. UPDATE PROFILE 
    @PutMapping("/{id}/update-profile")
    public ResponseEntity<User> updateProfile(@PathVariable int id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setEmail(userDetails.getEmail());
            // Logic method from Class Diagram
            user.updateProfile(userDetails.getName(), userDetails.getPhoneNumber());
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.login(email, password))
                .map(u -> ResponseEntity.ok("Login Successful for " + u.getName()))
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}