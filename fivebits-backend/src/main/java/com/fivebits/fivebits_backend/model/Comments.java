package com.fivebits.fivebits_backend.model;

// These imports tell Java we're using JPA (Java Persistence API)
// JPA is what connects Java objects to database tables
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity tells Spring: "This class represents a database table"
@Entity

// @Table tells Spring which table name to use in PostgreSQL
@Table(name = "comments")

public class Comments {

    // @Id means this field is the Primary Key
    // @GeneratedValue means PostgreSQL will auto-generate the ID (1, 2, 3, ...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // These match the columns in your todos table
    private String title;

    // ---- GETTERS ----
    // Getters allow other classes to READ these fields
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    // ---- SETTERS ----
    // Setters allow other classes to WRITE/CHANGE these fields
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}