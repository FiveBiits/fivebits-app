package com.fivebits.fivebits_backend.service;

import com.fivebits.fivebits_backend.dto.DashboardStatsResponse;
import com.fivebits.fivebits_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final IssueReportRepository issueRepository;
    private final BoardingPlaceRepository placeRepository;

    public DashboardStatsResponse getStudentStats(Long studentId) {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        long activeBookings = bookingRepository.findByStudentId(studentId).stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "ACTIVE".equals(b.getStatus()))
                .count();

        long totalPayments = paymentRepository.findByStudentId(studentId).size();

        long pendingIssues = issueRepository.findByStudentId(studentId).stream()
                .filter(i -> !"RESOLVED".equals(i.getStatus()) && !"CLOSED".equals(i.getStatus()))
                .count();

        stats.setActiveBookings(activeBookings);
        stats.setTotalPayments(totalPayments);
        stats.setPendingIssues(pendingIssues);

        return stats;
    }

    public DashboardStatsResponse getOwnerStats(Long ownerId) {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        var places = placeRepository.findByOwnerId(ownerId);
        stats.setActiveListings(places.size());

        long totalRooms = places.stream().mapToLong(p -> p.getAvailableRooms()).sum();
        stats.setAvailableRooms(totalRooms);

        long inquiries = bookingRepository.findByPlaceOwnerId(ownerId).stream()
                .filter(b -> "REQUESTED".equals(b.getStatus()))
                .count();
        stats.setTotalInquiries(inquiries);

        long tenants = bookingRepository.findByPlaceOwnerId(ownerId).stream()
                .filter(b -> "ACTIVE".equals(b.getStatus()) || "CONFIRMED".equals(b.getStatus()))
                .count();
        stats.setCurrentTenants(tenants);

        double revenue = paymentRepository.findByPlaceOwnerId(ownerId).stream()
                .filter(p -> "SUCCESSFUL".equals(p.getStatus()) || "RECEIPT_GENERATED".equals(p.getStatus()))
                .mapToDouble(p -> p.getAmount())
                .sum();
        stats.setTotalRevenue(revenue);

        return stats;
    }
}
