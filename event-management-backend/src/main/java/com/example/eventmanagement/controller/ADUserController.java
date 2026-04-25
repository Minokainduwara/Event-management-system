package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.ChangePasswordDTO;
import com.example.eventmanagement.dto.StudentProfileDTO;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADUserRepository;
import com.example.eventmanagement.services.ADUserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class ADUserController {
    @Autowired
    private ADUserService ADUserService;
@Autowired
private ADUserRepository ADUserRepository;
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

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDTO> getProfile(Authentication authentication) {

        String email = authentication.getName(); // usually username/email

        return ResponseEntity.ok(
                ADUserService.getProfileByEmail(email)
        );
    }

    // UPDATE PROFILE BY ID
    @PutMapping("/profile")
    public ResponseEntity<StudentProfileDTO> updateProfile(
            @RequestBody StudentProfileDTO dto,
            Authentication auth) {

        String email = auth.getName();

        return ResponseEntity.ok(
                ADUserService.updateProfileByEmail(email, dto)
        );
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDTO dto,
            Authentication auth) {

        String email = auth.getName();

        ADUserService.changePasswordByEmail(email, dto);

        return ResponseEntity.ok("Password updated");
    }
}
