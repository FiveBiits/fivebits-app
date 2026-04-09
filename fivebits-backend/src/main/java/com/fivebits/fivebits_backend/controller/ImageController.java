package com.fivebits.fivebits_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fivebits.fivebits_backend.dto.ImageResponse;
import com.fivebits.fivebits_backend.model.BoardingPlace;
import com.fivebits.fivebits_backend.model.BoardingPlaceImage;
import com.fivebits.fivebits_backend.repository.BoardingPlaceImageRepository;
import com.fivebits.fivebits_backend.repository.BoardingPlaceRepository;
import com.fivebits.fivebits_backend.service.ImageStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ImageController {

    private final ImageStorageService storageService;
    private final BoardingPlaceRepository placeRepository;
    private final BoardingPlaceImageRepository imageRepository;

    @GetMapping("/api/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = storageService.load(filename);
            if (!Files.exists(file)) {
                return ResponseEntity.notFound().build();
            }
            Resource resource = new UrlResource(file.toUri());
            String contentType = Files.probeContentType(file);
            if (contentType == null) contentType = "image/jpeg";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/places/{placeId}/images")
    public ResponseEntity<?> uploadImages(
            @PathVariable Long placeId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(defaultValue = "0") int mainIndex) {
        try {
            BoardingPlace place = placeRepository.findById(placeId)
                    .orElseThrow(() -> new RuntimeException("Place not found"));

            long existing = imageRepository.countByPlaceId(placeId);
            if (existing + files.length > 6) {
                return ResponseEntity.badRequest().body("Maximum 6 images allowed per place. Currently has " + existing);
            }

            // Clear existing main flags if we're setting a new main
            List<BoardingPlaceImage> existingImages = imageRepository.findByPlaceIdOrderByDisplayOrder(placeId);
            if (mainIndex >= 0 && mainIndex < files.length) {
                existingImages.forEach(img -> img.setMain(false));
                imageRepository.saveAll(existingImages);
            }

            List<BoardingPlaceImage> newImages = new ArrayList<>();
            for (int i = 0; i < files.length; i++) {
                String filename = storageService.store(files[i]);
                BoardingPlaceImage img = new BoardingPlaceImage();
                img.setFilename(filename);
                img.setOriginalName(files[i].getOriginalFilename());
                img.setMain(i == mainIndex);
                img.setDisplayOrder((int) existing + i);
                img.setPlace(place);
                newImages.add(img);
            }
            imageRepository.saveAll(newImages);

            // Return all images for this place
            List<ImageResponse> allImages = imageRepository.findByPlaceIdOrderByDisplayOrder(placeId)
                    .stream().map(this::toResponse).collect(Collectors.toList());
            return ResponseEntity.ok(allImages);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to store image");
        }
    }

    @DeleteMapping("/api/places/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        try {
            BoardingPlaceImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));
            Long placeId = image.getPlace().getId();
            boolean wasMain = image.isMain();

            storageService.delete(image.getFilename());
            imageRepository.delete(image);

            // If deleted image was main, set first remaining as main
            if (wasMain) {
                List<BoardingPlaceImage> remaining = imageRepository.findByPlaceIdOrderByDisplayOrder(placeId);
                if (!remaining.isEmpty()) {
                    remaining.get(0).setMain(true);
                    imageRepository.save(remaining.get(0));
                }
            }

            List<ImageResponse> allImages = imageRepository.findByPlaceIdOrderByDisplayOrder(placeId)
                    .stream().map(this::toResponse).collect(Collectors.toList());
            return ResponseEntity.ok(allImages);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/api/places/images/{imageId}/main")
    public ResponseEntity<?> setMainImage(@PathVariable Long imageId) {
        try {
            BoardingPlaceImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));
            Long placeId = image.getPlace().getId();

            List<BoardingPlaceImage> allImages = imageRepository.findByPlaceIdOrderByDisplayOrder(placeId);
            allImages.forEach(img -> img.setMain(img.getId().equals(imageId)));
            imageRepository.saveAll(allImages);

            List<ImageResponse> response = allImages.stream().map(this::toResponse).collect(Collectors.toList());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private ImageResponse toResponse(BoardingPlaceImage img) {
        return new ImageResponse(img.getId(), "/api/images/" + img.getFilename(), img.isMain(), img.getDisplayOrder());
    }
}
