package com.fivebits.fivebits_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class ImageStorageService {

    private static final Path UPLOAD_DIR = Paths.get("uploads/place-images");
    private static final long MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(UPLOAD_DIR);
    }

    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File exceeds 2 MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPG, PNG, and WebP images are allowed");
        }

        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;
        Path target = UPLOAD_DIR.resolve(filename).normalize();

        if (!target.startsWith(UPLOAD_DIR)) {
            throw new SecurityException("Invalid file path");
        }

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    public Path load(String filename) {
        Path path = UPLOAD_DIR.resolve(filename).normalize();
        if (!path.startsWith(UPLOAD_DIR)) {
            throw new SecurityException("Invalid file path");
        }
        return path;
    }

    public void delete(String filename) throws IOException {
        Path path = load(filename);
        Files.deleteIfExists(path);
    }

    private String getExtension(String name) {
        if (name == null) return ".jpg";
        int dot = name.lastIndexOf('.');
        if (dot < 0) return ".jpg";
        String ext = name.substring(dot).toLowerCase();
        // Whitelist extensions
        if (ext.equals(".jpg") || ext.equals(".jpeg") || ext.equals(".png") || ext.equals(".webp")) {
            return ext;
        }
        return ".jpg";
    }
}
