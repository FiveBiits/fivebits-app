package com.fivebits.fivebits_backend.controller;

import com.fivebits.fivebits_backend.model.Notification;
import com.fivebits.fivebits_backend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // GET ALL NOTIFICATIONS
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // CREATE NOTIFICATION
    @PostMapping("/create")
    public Notification createNotification(@RequestBody Notification notification) {
        notification.setStatus("Unread");
        return notificationRepository.save(notification);
    }

    // GET USER NOTIFICATIONS
    @GetMapping("/user/{userID}")
    public List<Notification> getUserNotifications(@PathVariable String userID) {
        return notificationRepository.findByUserID(userID);
    }

    // GET UNREAD NOTIFICATIONS
    @GetMapping("/user/{userID}/unread")
    public List<Notification> getUnreadNotifications(@PathVariable String userID) {
        return notificationRepository.findByUserIDAndStatus(userID, "Unread");
    }

    // MARK AS READ
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return notificationRepository.findById(id).map(notification -> {
            notification.markAsRead();
            return ResponseEntity.ok(notificationRepository.save(notification));
        }).orElse(ResponseEntity.notFound().build());
    }
}