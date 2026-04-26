package com.example.eventmanagement.services;

import com.example.eventmanagement.dto.ChangePasswordDTO;
import com.example.eventmanagement.dto.StudentProfileDTO;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADEventRegistrationRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ADUserService {

    @Autowired
    private ADUserRepository userRepository;

    @Autowired
    private ADEventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= SAVE USER =================
    public ADUser saveUser(ADUser user) {
        return userRepository.save(user);
    }

    // ================= GET ALL USERS =================
    public List<ADUser> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= GET ALL STUDENTS (FIXED) =================
    public List<ADUser> getAllStudents() {

        List<ADUser> students =
                userRepository.findByRole(ADUser.Role.STUDENT);

        for (ADUser user : students) {

            Integer userId = user.getUserId();

            if (userId == null) {
                user.setEventsRegistered(0);
                continue;
            }

            try {
                int count =
                        eventRegistrationRepository.countByUser_UserId(userId);

                user.setEventsRegistered(count);

            } catch (Exception e) {
                user.setEventsRegistered(0);
            }
        }

        return students;
    }

    // ================= GET USER BY ID =================
    public ADUser getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    // ================= UPDATE USER =================
    public ADUser updateUser(int id, ADUser user) {

        ADUser existing = userRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setName(user.getName());
            existing.setEmail(user.getEmail());
            existing.setPassword(user.getPassword());
            existing.setRole(user.getRole());
            existing.setUniversityId(user.getUniversityId());
            existing.setDepartment(user.getDepartment());
            existing.setYear(user.getYear());
            existing.setPhone(user.getPhone());

            return userRepository.save(existing);
        }

        return null;
    }

    // ================= DELETE USER =================
    public void deleteUser(int id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }

        userRepository.deleteById(id);
    }

    // ================= FILTER =================
    public List<ADUser> getStudentByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    // ================= SEARCH =================
    public List<ADUser> searchStudents(String keyword) {
        return userRepository
                .findByNameContainingIgnoreCaseOrUniversityIdContainingIgnoreCase(
                        keyword, keyword
                );
    }

    // ================= COUNT =================
    public long getStudentCount() {
        return userRepository.countByRole(ADUser.Role.STUDENT);
    }

    // ================= PROFILE =================
    public StudentProfileDTO getProfileByEmail(String email) {

        ADUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDTO(user);
    }

    public StudentProfileDTO updateProfileByEmail(String email,
                                                  StudentProfileDTO dto) {

        ADUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setUniversityId(dto.getUniversityId());
        user.setPhone(dto.getPhone());
        user.setDepartment(dto.getDepartment());
        user.setYear(dto.getYear());

        ADUser updated = userRepository.save(user);

        return mapToDTO(updated);
    }

    // ================= PASSWORD =================
    public void changePasswordByEmail(String email,
                                      ChangePasswordDTO dto) {

        ADUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    // ================= MAPPER =================
    private StudentProfileDTO mapToDTO(ADUser user) {

        StudentProfileDTO dto = new StudentProfileDTO();

        dto.setUniversityId(user.getUniversityId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setDepartment(user.getDepartment());
        dto.setYear(user.getYear());
        dto.setPhone(user.getPhone());
        dto.setEventsRegistered(user.getEventsRegistered());

        if (user.getCreatedAt() != null) {
            dto.setCreatedAt(
                    user.getCreatedAt()
                            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            );
        }

        return dto;
    }
}