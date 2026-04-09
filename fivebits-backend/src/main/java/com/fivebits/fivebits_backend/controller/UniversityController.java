package com.fivebits.fivebits_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fivebits.fivebits_backend.dto.UniversityResponse;
import com.fivebits.fivebits_backend.repository.UniversityRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityRepository universityRepository;

    @GetMapping
    public List<UniversityResponse> getAllUniversities() {
        return universityRepository.findAll().stream()
                .map(u -> new UniversityResponse(u.getId(), u.getName(), u.getLatitude(), u.getLongitude()))
                .collect(Collectors.toList());
    }
}
