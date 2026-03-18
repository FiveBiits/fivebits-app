package com.fivebits.fivebits_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fivebits.fivebits_backend.model.Student;
import com.fivebits.fivebits_backend.repository.StudentRepository;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // GET ALL STUDENTS 
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // SEARCH ROOM 
    @GetMapping("/search")
    public ResponseEntity<String> searchRoom() {
        // In a full implementation, this would call a service to filter BoardingPlaces
        return ResponseEntity.ok("Searching for available rooms based on student criteria...");
    }

    // REGISTER STUDENT
    @PostMapping("/register")
    public Student registerStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }
}
