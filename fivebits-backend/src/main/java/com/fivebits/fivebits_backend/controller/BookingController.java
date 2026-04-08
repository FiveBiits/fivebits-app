package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.dto.BookingRequest;
import com.fivebits.fivebits_backend.dto.BookingResponse;
import com.fivebits.fivebits_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.completeBooking(id));
    }

    @GetMapping("/student/{studentId}")
    public List<BookingResponse> getStudentBookings(@PathVariable Long studentId) {
        return bookingService.getStudentBookings(studentId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<BookingResponse> getOwnerBookings(@PathVariable Long ownerId) {
        return bookingService.getOwnerBookings(ownerId);
    }

    @GetMapping("/place/{placeId}")
    public List<BookingResponse> getPlaceBookings(@PathVariable Long placeId) {
        return bookingService.getPlaceBookings(placeId);
    }
}
