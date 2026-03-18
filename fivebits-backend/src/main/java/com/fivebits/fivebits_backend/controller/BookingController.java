package com.fivebits.fivebits_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fivebits.fivebits_backend.model.Booking;
import com.fivebits.fivebits_backend.repository.BookingRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // GET ALL BOOKINGS
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // CREATE BOOKING (State: Requested)
    @PostMapping("/create")
    public Booking createBooking(@RequestBody Booking booking) {
        booking.setStatus("Requested");
        return bookingRepository.save(booking);
    }

    // CONFIRM BOOKING
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable String id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.confirmBooking();
            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }

    // CANCEL BOOKING
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.cancelBooking();
            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }

    // COMPLETE BOOKING
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable String id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.completeBooking();
            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }
}
