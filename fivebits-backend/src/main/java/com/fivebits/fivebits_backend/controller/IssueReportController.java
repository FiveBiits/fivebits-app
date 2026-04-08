package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.dto.IssueReportRequest;
import com.fivebits.fivebits_backend.dto.IssueReportResponse;
import com.fivebits.fivebits_backend.service.IssueReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueReportController {

    private final IssueReportService issueService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitIssue(@RequestBody IssueReportRequest request) {
        try {
            return ResponseEntity.ok(issueService.submitIssue(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<IssueReportResponse> assignIssue(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.assignIssue(id));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<IssueReportResponse> resolveIssue(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(issueService.resolveIssue(id, body.get("reply")));
    }

    @GetMapping("/student/{studentId}")
    public List<IssueReportResponse> getStudentIssues(@PathVariable Long studentId) {
        return issueService.getStudentIssues(studentId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<IssueReportResponse> getOwnerIssues(@PathVariable Long ownerId) {
        return issueService.getOwnerIssues(ownerId);
    }

    @GetMapping("/place/{placeId}")
    public List<IssueReportResponse> getPlaceIssues(@PathVariable Long placeId) {
        return issueService.getPlaceIssues(placeId);
    }
}
