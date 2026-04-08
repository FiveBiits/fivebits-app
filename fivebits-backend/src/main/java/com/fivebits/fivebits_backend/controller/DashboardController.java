package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.dto.DashboardStatsResponse;
import com.fivebits.fivebits_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/student/{studentId}")
    public DashboardStatsResponse getStudentStats(@PathVariable Long studentId) {
        return dashboardService.getStudentStats(studentId);
    }

    @GetMapping("/owner/{ownerId}")
    public DashboardStatsResponse getOwnerStats(@PathVariable Long ownerId) {
        return dashboardService.getOwnerStats(ownerId);
    }
}
