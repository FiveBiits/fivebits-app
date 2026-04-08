package com.fivebits.fivebits_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueReportResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long placeId;
    private String placeName;
    private String description;
    private String status;
    private String reply;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
