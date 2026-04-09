package com.fivebits.fivebits_backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fivebits.fivebits_backend.dto.AuthResponse;
import com.fivebits.fivebits_backend.dto.LoginRequest;
import com.fivebits.fivebits_backend.dto.SignUpRequest;
import com.fivebits.fivebits_backend.model.BoardingOwner;
import com.fivebits.fivebits_backend.model.Student;
import com.fivebits.fivebits_backend.model.User;
import com.fivebits.fivebits_backend.repository.BoardingOwnerRepository;
import com.fivebits.fivebits_backend.repository.StudentRepository;
import com.fivebits.fivebits_backend.repository.UserRepository;
import com.fivebits.fivebits_backend.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final BoardingOwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse signUp(SignUpRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        User saved;

        String userType;

        if ("STUDENT".equalsIgnoreCase(req.getUserType())) {
            userType = "STUDENT";
            Student s = new Student();
            s.setName(req.getName());
            s.setEmail(req.getEmail());
            s.setPassword(passwordEncoder.encode(req.getPassword()));
            s.setPhoneNumber(req.getPhoneNumber());
            s.setUniversity(req.getUniversity());
            s.setCourseOfStudy(req.getCourseOfStudy());
            s.setStudentId(req.getStudentId());
            saved = studentRepository.save(s);

        } else if ("OWNER".equalsIgnoreCase(req.getUserType())) {
            userType = "OWNER";
            BoardingOwner o = new BoardingOwner();
            o.setName(req.getName());
            o.setEmail(req.getEmail());
            o.setPassword(passwordEncoder.encode(req.getPassword()));
            o.setPhoneNumber(req.getPhoneNumber());
            o.setBusinessName(req.getBusinessName());
            o.setAddress(req.getAddress());
            o.setNicNumber(req.getNicNumber());
            saved = ownerRepository.save(o);

        } else {
            throw new RuntimeException("userType must be STUDENT or OWNER.");
        }

        String token = jwtUtil.generateToken(saved.getEmail(), userType, saved.getId());
        return new AuthResponse(token, userType, saved.getName(), saved.getEmail(), saved.getId());
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        String token = jwtUtil.generateToken(user.getEmail(), user.getUserType(), user.getId());
        return new AuthResponse(token, user.getUserType(), user.getName(), user.getEmail(), user.getId());
    }
}