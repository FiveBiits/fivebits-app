package com.fivebits.fivebits_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fivebits.fivebits_backend.model.Comments;
import com.fivebits.fivebits_backend.repository.CommentsRepository;

// @Service tells Spring this class contains business logic
@Service
public class CommentsService {

    // @Autowired tells Spring to automatically create and inject
    // a TodoRepository object here — you don't create it manually
    @Autowired
    private CommentsRepository commentsRepository;

    // Get all todos from the database
    // This calls the auto-generated findAll() from JpaRepository
    public List<Comments> getAll() {
        return commentsRepository.findAll();
    }

    // Save a new todo to the database
    // save() will INSERT if the todo has no id, or UPDATE if it does
    public Comments create(Comments comments) {
        return commentsRepository.save(comments);
    }

    // Delete a todo by its id
    public void delete(Long id) {
        commentsRepository.deleteById(id);
    }
}