package com.example.demo.controller;

import com.example.demo.model.EventCategory;
import com.example.demo.services.CategoryService;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/addCategory")
    public EventCategory createCategory(@RequestBody EventCategory eventCategory)
    {
        return categoryService.createCategory(eventCategory);

    }
    @GetMapping("/getCategories")
    public List<EventCategory> getAllCategory(){
        return categoryService.getAllCategory();
    }
    @GetMapping("/getCategory/{id}")
    public EventCategory getCategoryById(@PathVariable int id){
         return categoryService.getCategoryById(id);
    }
    @PutMapping("/updateCategory/{id}")
    public EventCategory updateCategory(@PathVariable int id, @RequestBody EventCategory eventCategory){
        return categoryService.updateCategory(id,eventCategory);
    }
    @DeleteMapping("/deleteCategory/{id}")
    public String deleteCategory(@PathVariable int id){
        categoryService.deleteCategory(id);
        return  "Category Deleted Successfully";
    }

}
