package com.fivebits.fivebits_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fivebits.fivebits_backend.model.FoodStore;
import com.fivebits.fivebits_backend.repository.FoodStoreRepository;

import java.util.List;

@RestController
@RequestMapping("/api/food-stores")
public class FoodStoreController {

    @Autowired
    private FoodStoreRepository foodStoreRepository;

    @GetMapping("/nearby")
    public List<FoodStore> getNearby() {
        // This would typically use a service to filter by distance [cite: 161, 166]
        return foodStoreRepository.findAll();
    }

    @PostMapping
    public FoodStore addStore(@RequestBody FoodStore store) {
        return foodStoreRepository.save(store);
    }
}
