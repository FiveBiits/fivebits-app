package com.fivebits.fivebits_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.university")
public record UniversityProperties(double latitude, double longitude) {}