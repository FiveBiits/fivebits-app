package com.fivebits.fivebits_backend.dto;

import lombok.Data;

@Data
public class IssueReportRequest {
    private Long studentId;
    private Long placeId;
    private String description;
}
