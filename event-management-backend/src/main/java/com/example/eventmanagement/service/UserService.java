package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.StudentProfileDTO;

@Service
public class UserService {
    @Autowired
    private StudentService studentService;

    public StudentProfileDTO getCurrentUser(Long userId) throws Exception {
        return studentService.getStudentProfile(userId);
    }

    public StudentProfileDTO updateUserProfile(Long userId, StudentProfileDTO profileDTO) throws Exception {
        studentService.updateStudentProfile(userId, profileDTO);
        return studentService.getStudentProfile(userId);
    }
}
