package com.fivebits.fivebits_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fivebits.fivebits_backend.dto.BidRequest;
import com.fivebits.fivebits_backend.dto.BidResponse;
import com.fivebits.fivebits_backend.model.Bid;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.model.Booking;
import com.fivebits.fivebits_backend.model.Student;
import com.fivebits.fivebits_backend.repository.BidRepository;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import com.fivebits.fivebits_backend.repository.BookingRepository;
import com.fivebits.fivebits_backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BiddingService {

    private final BidRepository bidRepository;
    private final StudentRepository studentRepository;
    private final BoardingPlaceRepository placeRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    @Transactional
    public BidResponse placeBid(BidRequest request) {
        // Validate student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Validate place exists
        BoardingPlace place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new RuntimeException("Boarding place not found"));

        // Check if bidding is allowed on this place
        if (!place.isAllowBidding()) {
            throw new RuntimeException("Bidding is not allowed on this boarding place");
        }

                // Validate bid amount is positive
                if (request.getOfferedPrice() <= 0) {
                        throw new RuntimeException("Bid amount must be greater than 0");
                }

                // Determine current highest active bid (PENDING or ACCEPTED)
                double highestActive = 0.0;
                List<Bid> existingBids = bidRepository.findByPlaceIdOrderByCreatedAtDesc(place.getId());
                for (Bid b : existingBids) {
                        if ("PENDING".equals(b.getStatus()) || "ACCEPTED".equals(b.getStatus())) {
                                highestActive = Math.max(highestActive, b.getOfferedPrice());
                        }
                }

                double requiredMin = Math.max(place.getPrice(), highestActive);

                if (request.getOfferedPrice() < requiredMin) {
                        throw new RuntimeException("Bid must be at least LKR " + requiredMin);
                }

                // Check if the same student already has a pending bid for this place -> overwrite
                var existingOpt = bidRepository.findFirstByPlaceIdAndStudentIdAndStatusOrderByCreatedAtDesc(place.getId(), student.getId(), "PENDING");
                if (existingOpt.isPresent()) {
                        Bid existing = existingOpt.get();
                        if (request.getOfferedPrice() < existing.getOfferedPrice()) {
                                throw new RuntimeException("New bid must be greater than or equal to your previous bid");
                        }
                        existing.setOfferedPrice(request.getOfferedPrice());
                        Bid updated = bidRepository.save(existing);

                        // Notify owner about updated bid
                        notificationService.createNotification(
                                        place.getOwner().getId(),
                                        "Updated bid of LKR " + request.getOfferedPrice() + " from " + student.getName() +
                                                        " on " + place.getName(),
                                        "BID_UPDATED");

                        return toResponse(updated);
                }

                // Create new bid if no existing pending bid
                Bid bid = new Bid();
                bid.setStudent(student);
                bid.setPlace(place);
                bid.setOfferedPrice(request.getOfferedPrice());
                bid.setStatus("PENDING");

                Bid savedBid = bidRepository.save(bid);

                // Notify owner of new bid
                notificationService.createNotification(
                                place.getOwner().getId(),
                                "New bid of LKR " + request.getOfferedPrice() + " from " + student.getName() +
                                                " on " + place.getName(),
                                "BID_RECEIVED");

                return toResponse(savedBid);
    }

    @Transactional
    public BidResponse acceptBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        if (!bid.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending bids can be accepted");
        }

        // Mark bid as accepted
        bid.accept();
        Bid acceptedBid = bidRepository.save(bid);

        // Auto-create CONFIRMED booking
        Booking booking = new Booking();
        booking.setStudent(bid.getStudent());
        booking.setPlace(bid.getPlace());
        booking.setBid(bid);
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        // Reduce available rooms
        bid.getPlace().reduceAvailableRooms();
        placeRepository.save(bid.getPlace());

        // Notify student that bid was accepted
        notificationService.createNotification(
                bid.getStudent().getId(),
                "Your bid of LKR " + bid.getOfferedPrice() + " on " + bid.getPlace().getName() +
                        " has been accepted!",
                "BID_ACCEPTED");

        // Reject any other pending bids from same student on same place
        List<Bid> otherBids = bidRepository.findByPlaceIdOrderByCreatedAtDesc(bid.getPlace().getId());
        for (Bid otherBid : otherBids) {
            if (!otherBid.getId().equals(bidId) && otherBid.getStudent().getId().equals(bid.getStudent().getId()) &&
                    otherBid.getStatus().equals("PENDING")) {
                otherBid.setStatus("REJECTED");
                otherBid.setRejectedAt(LocalDateTime.now());
                bidRepository.save(otherBid);
            }
        }

        return toResponse(acceptedBid);
    }

    @Transactional
    public BidResponse rejectBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        if (!bid.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending bids can be rejected");
        }

        bid.reject();
        Bid rejectedBid = bidRepository.save(bid);

        // Notify student that bid was rejected
        notificationService.createNotification(
                bid.getStudent().getId(),
                "Your bid of LKR " + bid.getOfferedPrice() + " on " + bid.getPlace().getName() +
                        " has been rejected.",
                "BID_REJECTED");

        return toResponse(rejectedBid);
    }

    @Transactional
    public void withdrawBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        if (!bid.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending bids can be withdrawn");
        }

        bid.withdraw();
        bidRepository.save(bid);

        // Notify owner that bid was withdrawn
        notificationService.createNotification(
                bid.getPlace().getOwner().getId(),
                "Bid of LKR " + bid.getOfferedPrice() + " from " + bid.getStudent().getName() +
                        " on " + bid.getPlace().getName() + " has been withdrawn.",
                "BID_WITHDRAWN");
    }

        public List<BidResponse> getPlaceBids(Long placeId, Long requesterId) {
                // Expire old bids first (no-op if expiresAt is null)
                expireOldBids();

                BoardingPlace place = placeRepository.findById(placeId)
                                .orElseThrow(() -> new RuntimeException("Boarding place not found"));

                boolean isOwner = requesterId != null && place.getOwner() != null && requesterId.equals(place.getOwner().getId());

                // If bidding not allowed, return empty list
                if (!place.isAllowBidding()) return List.of();

                // Get all bids for place, ordered by createdAt desc
                List<Bid> bids = bidRepository.findByPlaceIdOrderByCreatedAtDesc(placeId);

                if (isOwner) {
                        // Owner: return each student's latest bid only (no duplicate students)
                        var latestByStudent = new java.util.LinkedHashMap<Long, Bid>();
                        for (Bid b : bids) {
                                Long sid = b.getStudent().getId();
                                if (!latestByStudent.containsKey(sid)) {
                                        latestByStudent.put(sid, b);
                                }
                        }
                        return latestByStudent.values().stream()
                                        .sorted((b1, b2) -> Double.compare(b2.getOfferedPrice(), b1.getOfferedPrice()))
                                        .map(this::toResponse)
                                        .collect(Collectors.toList());
                } else {
                        // Non-owner: only expose the current highest active bid (PENDING or ACCEPTED)
                        double highest = 0.0;
                        Bid highestBid = null;
                        for (Bid b : bids) {
                                if ("PENDING".equals(b.getStatus()) || "ACCEPTED".equals(b.getStatus())) {
                                        if (b.getOfferedPrice() > highest) {
                                                highest = b.getOfferedPrice();
                                                highestBid = b;
                                        }
                                }
                        }
                        if (highestBid == null) return List.of();
                        BidResponse resp = toResponse(highestBid);
                        // Hide student identity for non-owners
                        resp.setStudentId(null);
                        resp.setStudentName(null);
                        return List.of(resp);
                }
        }

    public List<BidResponse> getStudentBids(Long studentId) {
        List<Bid> bids = bidRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        return bids.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void expireOldBids() {
        // Find all PENDING bids that are past expiration time
        List<Bid> expiredBids = bidRepository.findByStatusAndExpiresAtBefore("PENDING",
                LocalDateTime.now());

        for (Bid bid : expiredBids) {
            bid.setStatus("EXPIRED");
            bidRepository.save(bid);

            // Notify student that bid expired
            notificationService.createNotification(
                    bid.getStudent().getId(),
                    "Your bid of LKR " + bid.getOfferedPrice() + " on " + bid.getPlace().getName() +
                            " has expired.",
                    "BID_EXPIRED");
        }
    }

    private BidResponse toResponse(Bid bid) {
        BidResponse response = new BidResponse();
        response.setId(bid.getId());
        response.setPlaceId(bid.getPlace().getId());
        response.setPlaceName(bid.getPlace().getName());
        response.setStudentId(bid.getStudent().getId());
        response.setStudentName(bid.getStudent().getName());
        response.setOfferedPrice(bid.getOfferedPrice());
        response.setOriginalPrice(bid.getPlace().getPrice());
        response.setStatus(bid.getStatus());
        response.setCreatedAt(bid.getCreatedAt());
        response.setExpiresAt(bid.getExpiresAt());
        response.setAcceptedAt(bid.getAcceptedAt());
        response.setRejectedAt(bid.getRejectedAt());
        return response;
    }
}
