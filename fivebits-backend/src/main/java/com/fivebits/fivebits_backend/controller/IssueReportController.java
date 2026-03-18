package com.fivebits.fivebits_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fivebits.fivebits_backend.model.IssueReport;
import com.fivebits.fivebits_backend.repository.IssueReportRepository;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueReportController {

    private final IssueReportRepository issueRepository;

    public IssueReportController(IssueReportRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    @GetMapping
    public List<IssueReport> getAllIssues() {
        return issueRepository.findAll();
    }

    // SUBMIT COMPLAINT (State: Submitted)
    @PostMapping("/submit")
    public IssueReport submitIssue(@RequestBody IssueReport report) {
        report.updateComplaintStatus("Submitted");
        return issueRepository.save(report);
    }

    
    @PatchMapping("/{id}/assign")
    public ResponseEntity<IssueReport> assignIssue(@PathVariable String id) {
        return issueRepository.findById(id).map(report -> {
            report.assignToOwner();
            return ResponseEntity.ok(issueRepository.save(report));
        }).orElse(ResponseEntity.notFound().build());
    }
}
