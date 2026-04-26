package com.example.eventmanagement.controller;

import com.example.eventmanagement.services.OGCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
public class OGCategoryController {

    @Autowired
    private OGCategoryService categoryService;

    @GetMapping("/getCategories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}
