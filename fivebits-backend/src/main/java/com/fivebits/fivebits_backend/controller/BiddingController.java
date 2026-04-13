package com.fivebits.fivebits_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fivebits.fivebits_backend.dto.BidRequest;
import com.fivebits.fivebits_backend.dto.BidResponse;
import com.fivebits.fivebits_backend.model.User;
import com.fivebits.fivebits_backend.repository.UserRepository;
import com.fivebits.fivebits_backend.service.BiddingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
@CrossOrigin
public class BiddingController {

    private final BiddingService biddingService;
    private final UserRepository userRepository;

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody BidRequest request) {
        try {
            // Resolve authenticated user (student) from security context if available
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
                String email = ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername();
                User u = userRepository.findByEmail(email).orElse(null);
                if (u == null) return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("User not found");
                if (!"STUDENT".equals(u.getUserType())) return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Only students can place bids");
                request.setStudentId(u.getId());
            }
            return ResponseEntity.ok(biddingService.placeBid(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<BidResponse>> getPlaceBids(@PathVariable Long placeId) {
        try {
            Long requesterId = null;
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
                String email = ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername();
                User u = userRepository.findByEmail(email).orElse(null);
                if (u != null) requesterId = u.getId();
            }
            return ResponseEntity.ok(biddingService.getPlaceBids(placeId, requesterId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BidResponse>> getStudentBids(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok(biddingService.getStudentBids(studentId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(biddingService.acceptBid(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectBid(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(biddingService.rejectBid(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> withdrawBid(@PathVariable Long id) {
        try {
            biddingService.withdrawBid(id);
            return ResponseEntity.ok("Bid withdrawn successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
