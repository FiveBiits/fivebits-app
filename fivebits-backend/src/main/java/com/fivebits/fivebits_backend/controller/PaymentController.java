package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.model.Payment;
import com.fivebits.fivebits_backend.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // GET ALL PAYMENTS
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // CREATE PAYMENT (State: Created)
    @PostMapping("/create")
    public Payment createPayment(@RequestBody Payment payment) {
        payment.setStatus("Created");
        return paymentRepository.save(payment);
    }

    // PROCESS PAYMENT
    @PatchMapping("/{id}/process")
    public ResponseEntity<Payment> processPayment(@PathVariable String id) {
        return paymentRepository.findById(id).map(payment -> {
            payment.processPayment();
            return ResponseEntity.ok(paymentRepository.save(payment));
        }).orElse(ResponseEntity.notFound().build());
    }

    // MARK AS SUCCESSFUL
    @PatchMapping("/{id}/success")
    public ResponseEntity<Payment> markSuccessful(@PathVariable String id) {
        return paymentRepository.findById(id).map(payment -> {
            payment.markSuccessful();
            return ResponseEntity.ok(paymentRepository.save(payment));
        }).orElse(ResponseEntity.notFound().build());
    }

    // MARK AS FAILED
    @PatchMapping("/{id}/fail")
    public ResponseEntity<Payment> markFailed(@PathVariable String id) {
        return paymentRepository.findById(id).map(payment -> {
            payment.markFailed();
            return ResponseEntity.ok(paymentRepository.save(payment));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GENERATE RECEIPT
    @PatchMapping("/{id}/receipt")
    public ResponseEntity<Payment> generateReceipt(@PathVariable String id) {
        return paymentRepository.findById(id).map(payment -> {
            payment.generateReceipt();
            return ResponseEntity.ok(paymentRepository.save(payment));
        }).orElse(ResponseEntity.notFound().build());
    }
}
