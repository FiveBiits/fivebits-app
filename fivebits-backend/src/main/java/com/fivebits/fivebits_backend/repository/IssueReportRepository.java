package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.IssueReport;

import java.util.List;

public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {

    List<IssueReport> findByStudentId(Long studentId);

    List<IssueReport> findByPlaceId(Long placeId);

    List<IssueReport> findByPlaceOwnerId(Long ownerId);

    List<IssueReport> findByStatus(String status);
}
