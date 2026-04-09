package com.fivebits.fivebits_backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

        payment.setTransactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return toResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse processPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.processPayment();
        payment.markSuccessful();
        payment.generateReceipt();

        if (payment.getPlace() != null) {
            notificationService.createNotification(
                    payment.getPlace().getOwner().getId(),
                    "Payment of LKR " + payment.getAmount() + " received from " + payment.getStudent().getName(),
                    "PAYMENT"
            );
        }

        return toResponse(paymentRepository.save(payment));
    }

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
