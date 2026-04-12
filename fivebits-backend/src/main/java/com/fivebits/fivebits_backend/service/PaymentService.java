package com.fivebits.fivebits_backend.service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fivebits.fivebits_backend.dto.PaymentRequest;
import com.fivebits.fivebits_backend.dto.PaymentResponse;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.model.Booking;
import com.fivebits.fivebits_backend.model.Payment;
import com.fivebits.fivebits_backend.model.Student;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import com.fivebits.fivebits_backend.repository.BookingRepository;
import com.fivebits.fivebits_backend.repository.PaymentRepository;
import com.fivebits.fivebits_backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final BoardingPlaceRepository placeRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    // These values pull from your .env file
    @Value("${PAYHERE_MERCHANT_ID:}")
    private String merchantId;

    @Value("${PAYHERE_SECRET:}")
    private String merchantSecret;

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod());
        payment.setType(request.getType());

        if (request.getPlaceId() != null) {
            BoardingPlace place = placeRepository.findById(request.getPlaceId())
                    .orElseThrow(() -> new RuntimeException("Boarding place not found"));
            payment.setPlace(place);
        }

        if (request.getBookingId() != null) {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            payment.setBooking(booking);
        }

        // Generate a unique reference
        String txnRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        payment.setTransactionRef(txnRef);

        // Save the pending payment
        Payment savedPayment = paymentRepository.save(payment);

        // Calculate the PayHere Hash
        String hash = generatePayHereHash(txnRef, request.getAmount());

        // Map to response and include the hash for the frontend
        PaymentResponse response = toResponse(savedPayment);
        response.setHash(hash);
        response.setMerchantId(merchantId);
        
        return response;
    }

    @Transactional
    public PaymentResponse processPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Logic for marking successful (called by the Notify endpoint later)
        payment.setStatus("SUCCESS"); 
        payment.setPaidAt(java.time.LocalDateTime.now());

        if (payment.getPlace() != null) {
            notificationService.createNotification(
                    payment.getPlace().getOwner().getId(),
                    "Payment of LKR " + payment.getAmount() + " received from " + payment.getStudent().getName(),
                    "PAYMENT"
            );
        }

        return toResponse(paymentRepository.save(payment));
    }

    // --- HELPER METHODS FOR PAYHERE ---

    private String generatePayHereHash(String orderId, double amount) {
        // PayHere Hash Formula: MerchantID + OrderID + Amount + Currency + MD5(MerchantSecret)
        String currency = "LKR";
        String merchantSecretHash = md5(merchantSecret).toUpperCase();
        
        // Formatted amount (PayHere likes decimals or standard string representation)
        String amountString = String.format("%.2f", amount); 
        
        String source = merchantId + orderId + amountString + currency + merchantSecretHash;
        return md5(source).toUpperCase();
    }

    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }

    // --- MAPPING METHODS ---

    public List<PaymentResponse> getStudentPayments(Long studentId) {
        return paymentRepository.findByStudentId(studentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getOwnerPayments(Long ownerId) {
        return paymentRepository.findByPlaceOwnerId(ownerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse toResponse(Payment payment) {
        PaymentResponse resp = new PaymentResponse();
        resp.setId(payment.getId());
        resp.setStudentId(payment.getStudent().getId());
        resp.setStudentName(payment.getStudent().getName());
        if (payment.getPlace() != null) {
            resp.setPlaceId(payment.getPlace().getId());
            resp.setPlaceName(payment.getPlace().getName());
        }
        if (payment.getBooking() != null) {
            resp.setBookingId(payment.getBooking().getId());
        }
        resp.setAmount(payment.getAmount());
        resp.setMethod(payment.getMethod());
        resp.setType(payment.getType());
        resp.setStatus(payment.getStatus());
        resp.setTransactionRef(payment.getTransactionRef());
        resp.setCreatedAt(payment.getCreatedAt());
        resp.setPaidAt(payment.getPaidAt());
        return resp;
    }
}