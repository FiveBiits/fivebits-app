package com.fivebits.fivebits_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fivebits.fivebits_backend.model.Comments;
import com.fivebits.fivebits_backend.service.CommentsService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*") // Allow all origins in development
public class CommentsController {

    @Autowired
    private CommentsService commentsService;

    @GetMapping
    public List<Comments> getAll() {
        return commentsService.getAll();
    }

    @PostMapping
    public Comments create(@RequestBody Comments comments) {
        return commentsService.create(comments);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commentsService.delete(id);
    }
}