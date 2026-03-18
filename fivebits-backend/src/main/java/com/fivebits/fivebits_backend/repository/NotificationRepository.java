package com.fivebits.fivebits_backend.repository;

import com.fivebits.fivebits_backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    // Get notifications for a specific user
    List<Notification> findByUserID(String userID);

    // Get unread notifications
    List<Notification> findByUserIDAndStatus(String userID, String status);
}