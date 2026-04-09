package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.dto.PaymentRequest;
import com.fivebits.fivebits_backend.dto.PaymentResponse;
import com.fivebits.fivebits_backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin // Add this so React can connect
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createPayment(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PayHere calls this hidden URL to confirm payment success
    @PostMapping("/notify")
    public ResponseEntity<String> paymentNotify(@RequestParam Map<String, String> allParams) {
        // We will add the logic to verify the PayHere signal here later
        System.out.println("PayHere Notification Received: " + allParams);
        return ResponseEntity.ok("Notification Received");
    }

    @PatchMapping("/{id}/process")
    public ResponseEntity<PaymentResponse> processPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.processPayment(id));
    }

    @GetMapping("/student/{studentId}")
    public List<PaymentResponse> getStudentPayments(@PathVariable Long studentId) {
        return paymentService.getStudentPayments(studentId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<PaymentResponse> getOwnerPayments(@PathVariable Long ownerId) {
        return paymentService.getOwnerPayments(ownerId);
    }
}