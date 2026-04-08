package com.fivebits.fivebits_backend.service;

import com.fivebits.fivebits_backend.dto.IssueReportRequest;
import com.fivebits.fivebits_backend.dto.IssueReportResponse;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.model.IssueReport;
import com.fivebits.fivebits_backend.model.Student;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import com.fivebits.fivebits_backend.repository.IssueReportRepository;
import com.fivebits.fivebits_backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueReportService {

    private final IssueReportRepository issueRepository;
    private final StudentRepository studentRepository;
    private final BoardingPlaceRepository placeRepository;
    private final NotificationService notificationService;

    @Transactional
    public IssueReportResponse submitIssue(IssueReportRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        BoardingPlace place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new RuntimeException("Boarding place not found"));

        IssueReport issue = new IssueReport();
        issue.setStudent(student);
        issue.setPlace(place);
        issue.setDescription(request.getDescription());

        IssueReport saved = issueRepository.save(issue);

        notificationService.createNotification(
                place.getOwner().getId(),
                "New issue reported by " + student.getName() + " at " + place.getName(),
                "ISSUE"
        );

        return toResponse(saved);
    }

    @Transactional
    public IssueReportResponse assignIssue(Long issueId) {
        IssueReport issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        issue.assignToOwner();
        return toResponse(issueRepository.save(issue));
    }

    @Transactional
    public IssueReportResponse resolveIssue(Long issueId, String reply) {
        IssueReport issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.resolve(reply);

        notificationService.createNotification(
                issue.getStudent().getId(),
                "Your issue at " + issue.getPlace().getName() + " has been resolved.",
                "ISSUE"
        );

        return toResponse(issueRepository.save(issue));
    }

    public List<IssueReportResponse> getStudentIssues(Long studentId) {
        return issueRepository.findByStudentId(studentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<IssueReportResponse> getOwnerIssues(Long ownerId) {
        return issueRepository.findByPlaceOwnerId(ownerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<IssueReportResponse> getPlaceIssues(Long placeId) {
        return issueRepository.findByPlaceId(placeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private IssueReportResponse toResponse(IssueReport issue) {
        IssueReportResponse resp = new IssueReportResponse();
        resp.setId(issue.getId());
        resp.setStudentId(issue.getStudent().getId());
        resp.setStudentName(issue.getStudent().getName());
        resp.setPlaceId(issue.getPlace().getId());
        resp.setPlaceName(issue.getPlace().getName());
        resp.setDescription(issue.getDescription());
        resp.setStatus(issue.getStatus());
        resp.setReply(issue.getReply());
        resp.setCreatedAt(issue.getCreatedAt());
        resp.setResolvedAt(issue.getResolvedAt());
        return resp;
    }
}
