package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADUserRepository;
import com.example.eventmanagement.services.ADUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class ADUserController {

    @Autowired
    private ADUserService userService;

    @Autowired
    private ADUserRepository userRepository;

    // ================= REGISTER (FIXED - DTO BASED) =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        ADUser user = new ADUser();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setUniversityId(dto.getUniversityId());

        // DEFAULT ROLE
        user.setRole(ADUser.Role.STUDENT);

        ADUser savedUser = userService.saveUser(user);

        return ResponseEntity.ok(savedUser);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        ADUser user = userRepository.findByEmail(dto.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

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
    public ADUser getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/updateUser/{id}")
    public ADUser updateUser(@PathVariable Integer id, @RequestBody ADUser user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable Integer id) {
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

    // ================= PASSWORD =================
    @PutMapping("/change-password")
    public String changePassword(@RequestParam String email,
                                 @RequestBody ChangePasswordDTO dto) {
        userService.changePasswordByEmail(email, dto);
        return "Password updated";
    }
}