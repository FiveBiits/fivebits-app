package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fivebits.fivebits_backend.model.IssueReport;

public interface IssueReportRepository extends JpaRepository<IssueReport, String> {
}
