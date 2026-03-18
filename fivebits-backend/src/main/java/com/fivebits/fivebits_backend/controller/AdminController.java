package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.model.Admin;
import com.fivebits.fivebits_backend.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    // GET ALL ADMINS
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // REGISTER ADMIN
    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }

    // UPDATE PROFILE
    @PatchMapping("/{id}/update")
    public ResponseEntity<Admin> updateAdmin(
            @PathVariable String id,
            @RequestBody Admin updatedAdmin) {

        return adminRepository.findById(id).map(admin -> {
            admin.updateProfile(updatedAdmin.getName());
            return ResponseEntity.ok(adminRepository.save(admin));
        }).orElse(ResponseEntity.notFound().build());
    }

    // RESET PASSWORD
    @PatchMapping("/{id}/reset-password")
    public ResponseEntity<Admin> resetPassword(
            @PathVariable String id,
            @RequestParam String newPassword) {

        return adminRepository.findById(id).map(admin -> {
            admin.resetPassword(newPassword);
            return ResponseEntity.ok(adminRepository.save(admin));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        return adminRepository.findById(id).map(admin -> {
            adminRepository.delete(admin);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}