package com.fivebits.fivebits_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fivebits.fivebits_backend.dto.BookingRequest;
import com.fivebits.fivebits_backend.dto.BookingResponse;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.model.Booking;
import com.fivebits.fivebits_backend.model.Student;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import com.fivebits.fivebits_backend.repository.BookingRepository;
import com.fivebits.fivebits_backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final StudentRepository studentRepository;
    private final BoardingPlaceRepository placeRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        BoardingPlace place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new RuntimeException("Boarding place not found"));

        if (place.getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms available at this boarding place");
        }

        boolean alreadyBooked = bookingRepository.existsByStudentIdAndPlaceIdAndStatusIn(
                request.getStudentId(), request.getPlaceId(),
                List.of("REQUESTED", "CONFIRMED", "ACTIVE"));
        if (alreadyBooked) {
            throw new RuntimeException("You already have an active booking for this boarding place");
        }

        Booking booking = new Booking();
        booking.setStudent(student);
        booking.setPlace(place);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());

        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(
                place.getOwner().getId(),
                "New booking request from " + student.getName() + " for " + place.getName(),
                "BOOKING"
        );

        return toResponse(saved);
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getPlace().getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms available to confirm this booking");
        }

        booking.confirmBooking();
        booking.getPlace().reduceAvailableRooms();
        placeRepository.save(booking.getPlace());

        notificationService.createNotification(
                booking.getStudent().getId(),
                "Your booking for " + booking.getPlace().getName() + " has been confirmed!",
                "BOOKING"
        );

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CONFIRMED".equals(booking.getStatus()) || "ACTIVE".equals(booking.getStatus())) {
            booking.getPlace().increaseAvailableRooms();
            placeRepository.save(booking.getPlace());
        }

        booking.cancelBooking();
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.completeBooking();
        booking.getPlace().increaseAvailableRooms();
        placeRepository.save(booking.getPlace());

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getStudentBookings(Long studentId) {
        return bookingRepository.findByStudentId(studentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByPlaceOwnerId(ownerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getPlaceBookings(Long placeId) {
        return bookingRepository.findByPlaceId(placeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse toResponse(Booking booking) {
        BookingResponse resp = new BookingResponse();
        resp.setId(booking.getId());
        resp.setStudentId(booking.getStudent().getId());
        resp.setStudentName(booking.getStudent().getName());
        resp.setPlaceId(booking.getPlace().getId());
        resp.setPlaceName(booking.getPlace().getName());
        resp.setPlaceLocation(booking.getPlace().getLocation());
        resp.setPlacePrice(booking.getPlace().getPrice());
        resp.setStartDate(booking.getStartDate());
        resp.setEndDate(booking.getEndDate());
        resp.setStatus(booking.getStatus());
        resp.setCreatedAt(booking.getCreatedAt());
        return resp;
    }
}
