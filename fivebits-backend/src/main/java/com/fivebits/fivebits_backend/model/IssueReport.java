package com.fivebits.fivebits_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "issue_reports")
public class IssueReport {

    @Id
    private String issueID;  
    private String complaintText;  
    private Date dateSubmitted; 
    private String status;  
    private String reply;  

    public IssueReport() {}

    public IssueReport(String issueID, String complaintText) {
        this.issueID = issueID;
        this.complaintText = complaintText;
        this.dateSubmitted = new Date();
        this.status = "Submitted";
    }

    // Methods  
    public void updateComplaintStatus(String newStatus) {
        this.status = newStatus;
    }

    public void assignToOwner() {
        this.status = "Assigned"; 
    }

    // Getters and Setters 
    public String getIssueID() { return issueID; }
    public String getComplaintText() { return complaintText; }
    public Date getDateSubmitted() { return dateSubmitted; }
    public String getStatus() { return status; }
    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}