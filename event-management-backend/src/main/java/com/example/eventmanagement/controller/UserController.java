package com.example.eventmanagement.controller;

import com.example.eventmanagement.model.User;
import com.example.eventmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/saveUser")
    public User saveUser(@RequestBody  User user){
        return userService.saveUser(user);
    }
    @GetMapping("/getAllUsers")
    public List<User>  getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/getUser/{id}")
    public User getUserById(@PathVariable int id){
        return userService.getUserById(id);
    }
    @PutMapping("/updateUser/{id}")
    public User updateUser(@PathVariable int id ,@RequestBody User user){
        return userService.updateUser(id,user);
    }
    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id){
        userService.deleteUser(id);
        return "User Deleted Successfully";
    }
    @GetMapping("/getAllStudents")
    public List<User> getAllStudents(){
        return userService.getAllStudents();
    }
    @GetMapping("/students/department/{dept}")
    public List<User> getStudentByDepartment(@PathVariable String dept)
    {
        return userService.getStudentByDepartment(dept);
    }
    @GetMapping("/students/search")
    public List<User> searchStudents(@RequestParam String keyword)
    {
        return userService.searchStudents(keyword);
    }
    @GetMapping("/students/count")
    public long getStudentCount()
    {
        return userService.getStudentCount();
    }
}
