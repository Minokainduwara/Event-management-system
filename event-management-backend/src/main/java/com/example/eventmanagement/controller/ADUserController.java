package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.services.ADUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class ADUserController {
    @Autowired
    private ADUserService ADUserService;

    @PostMapping("/saveUser")
    public ADUser saveUser(@RequestBody ADUser ADUser){
        return ADUserService.saveUser(ADUser);
    }
    @GetMapping("/getAllUsers")
    public List<ADUser>  getAllUsers(){
        return ADUserService.getAllUsers();
    }
    @GetMapping("/getUser/{id}")
    public ADUser getUserById(@PathVariable int id){
        return ADUserService.getUserById(id);
    }
    @PutMapping("/updateUser/{id}")
    public ADUser updateUser(@PathVariable int id , @RequestBody ADUser ADUser){
        return ADUserService.updateUser(id, ADUser);
    }
    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id){
        ADUserService.deleteUser(id);
        return "User Deleted Successfully";
    }
    @GetMapping("/getAllStudents")
    public List<ADUser> getAllStudents(){
        return ADUserService.getAllStudents();
    }
    @GetMapping("/students/department/{dept}")
    public List<ADUser> getStudentByDepartment(@PathVariable String dept)
    {
        return ADUserService.getStudentByDepartment(dept);
    }
    @GetMapping("/students/search")
    public List<ADUser> searchStudents(@RequestParam String keyword)
    {
        return ADUserService.searchStudents(keyword);
    }
    @GetMapping("/students/count")
    public long getStudentCount()
    {
        return ADUserService.getStudentCount();
    }
}
