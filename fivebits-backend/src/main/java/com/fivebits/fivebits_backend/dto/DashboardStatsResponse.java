package com.fivebits.fivebits_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    // Student stats
    private long activeBookings;
    private long totalPayments;
    private long pendingIssues;
    private long savedPlaces;

    // Owner stats
    private long activeListings;
    private long totalInquiries;
    private long currentTenants;
    private long availableRooms;
    private double totalRevenue;
}
