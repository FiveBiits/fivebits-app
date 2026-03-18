package com.fivebits.fivebits_backend.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fivebits.fivebits_backend.model.UtilityBill;
import com.fivebits.fivebits_backend.repository.UtilityBillRepository;

import java.util.List;

@RestController
@RequestMapping("/api/utility-bills")
public class UtilityBillController {

    @Autowired
    private UtilityBillRepository utilityBillRepository;

    @GetMapping
    public List<UtilityBill> getAllBills() {
        return utilityBillRepository.findAll();
    }

    @PostMapping("/generate")
    public UtilityBill createBill(@RequestBody UtilityBill bill) {
        bill.generateBill(); // [cite: 158]
        return utilityBillRepository.save(bill);
    }
}
