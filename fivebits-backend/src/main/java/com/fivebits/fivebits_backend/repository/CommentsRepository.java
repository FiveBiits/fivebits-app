package com.fivebits.fivebits_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fivebits.fivebits_backend.model.Comments;

// @Repository tells Spring this is a database access layer
@Repository

// JpaRepository<Todo, Long> means:
//   - Todo  = the class that maps to the database table
//   - Long  = the data type of the primary key (id)
// By extending JpaRepository, you automatically get these methods for FREE:
//   - findAll()        → SELECT * FROM todos
//   - findById(id)     → SELECT * FROM todos WHERE id = ?
//   - save(todo)       → INSERT or UPDATE
//   - deleteById(id)   → DELETE FROM todos WHERE id = ?
//   - count()          → SELECT COUNT(*) FROM todos

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    // You don't need to write anything here for basic CRUD operations
    // Spring automatically provides all the methods listed above
}