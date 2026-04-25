package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.ChangePasswordDTO;
import com.example.eventmanagement.dto.LoginDTO;
import com.example.eventmanagement.dto.StudentProfileDTO;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADUserRepository;
import com.example.eventmanagement.services.ADUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173") // React Vite
public class ADUserController {

    @Autowired
    private ADUserService userService;

    @Autowired
    private ADUserRepository userRepository;

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        ADUser user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ⚠️ plain password check (NO JWT yet)
        if (!user.getPassword().equals(dto.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        return ResponseEntity.ok(user);
    }

    // ================= CRUD =================

    @PostMapping("/saveUser")
    public ADUser saveUser(@RequestBody ADUser user) {
        return userService.saveUser(user);
    }

    @GetMapping("/getAllUsers")
    public List<ADUser> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/getUser/{id}")
    public ADUser getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @PutMapping("/updateUser/{id}")
    public ADUser updateUser(@PathVariable int id, @RequestBody ADUser user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return "User Deleted Successfully";
    }

    // ================= STUDENTS =================

    @GetMapping("/getAllStudents")
    public List<ADUser> getAllStudents() {
        return userService.getAllStudents();
    }

    @GetMapping("/students/department/{dept}")
    public List<ADUser> getByDepartment(@PathVariable String dept) {
        return userService.getStudentByDepartment(dept);
    }

    @GetMapping("/students/search")
    public List<ADUser> search(@RequestParam String keyword) {
        return userService.searchStudents(keyword);
    }

    @GetMapping("/students/count")
    public long count() {
        return userService.getStudentCount();
    }

    // ================= PROFILE =================

    @GetMapping("/profile")
    public StudentProfileDTO profile(@RequestParam String email) {
        return userService.getProfileByEmail(email);
    }

    @PutMapping("/profile")
    public StudentProfileDTO updateProfile(@RequestParam String email,
                                           @RequestBody StudentProfileDTO dto) {
        return userService.updateProfileByEmail(email, dto);
    }

    @PutMapping("/change-password")
    public String changePassword(@RequestParam String email,
                                 @RequestBody ChangePasswordDTO dto) {
        userService.changePasswordByEmail(email, dto);
        return "Password updated";
    }
}