package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.ADEventCategory;
import com.example.eventmanagement.services.ADCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@CrossOrigin(origins = "http://localhost:5173")
public class ADCategoryController {

    @Autowired
    private ADCategoryService ADCategoryService;

    @PostMapping("/addCategory")
    public ADEventCategory createCategory(@RequestBody ADEventCategory ADEventCategory)
    {
        return ADCategoryService.createCategory(ADEventCategory);

    }
    @GetMapping("/getCategories")
    public List<ADEventCategory> getAllCategory(){
        return ADCategoryService.getAllCategory();
    }
    @GetMapping("/getCategory/{id}")
    public ADEventCategory getCategoryById(@PathVariable int id){
         return ADCategoryService.getCategoryById(id);
    }
    @PutMapping("/updateCategory/{id}")
    public ADEventCategory updateCategory(@PathVariable int id, @RequestBody ADEventCategory ADEventCategory){
        return ADCategoryService.updateCategory(id, ADEventCategory);
    }
    @DeleteMapping("/deleteCategory/{id}")
    public String deleteCategory(@PathVariable int id){
        ADCategoryService.deleteCategory(id);
        return  "Category Deleted Successfully";
    }

}
