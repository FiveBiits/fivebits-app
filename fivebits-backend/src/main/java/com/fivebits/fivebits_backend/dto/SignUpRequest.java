package com.fivebits.fivebits_backend.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String userType;

    private String university;
    private String courseOfStudy;
    private String studentId;

    private String businessName;
    private String address;
    private String nicNumber;
}