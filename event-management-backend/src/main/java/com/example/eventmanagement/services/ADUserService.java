package com.example.eventmanagement.services;

import com.example.eventmanagement.dto.ChangePasswordDTO;
import com.example.eventmanagement.dto.StudentProfileDTO;
import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADEventRegistrationRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ADUserService {
    @Autowired
    private ADUserRepository ADUserRepository;
    @Autowired
    private ADEventRegistrationRepository ADEventRegistrationRepository;
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    public ADUser saveUser(ADUser ADUser){
        return ADUserRepository.save(ADUser);
    }

    public List<ADUser> getAllUsers()
    {
        return ADUserRepository.findAll();
    }
    public List<ADUser> getAllStudents(){
        List<ADUser> students= ADUserRepository.findByRole(ADUser.Role.STUDENT);
        for(ADUser ADUser :students){
            int count= ADEventRegistrationRepository.countByUser_UserId(ADUser.getUserId());
            ADUser.setEventsRegistered(count);
        }
        return students;
    }
    public ADUser getUserById(int id){
        return ADUserRepository.findById(id).orElse(null);
    }
    public ADUser updateUser(int id, ADUser ADUser){
        ADUser u= ADUserRepository.findById(id).orElse(null);
        if(u!=null){
            u.setName(ADUser.getName());
            u.setEmail(ADUser.getEmail());
            u.setPassword(ADUser.getPassword());
            u.setRole(ADUser.getRole());
            u.setUniversityId(ADUser.getUniversityId());
            u.setDepartment(ADUser.getDepartment());
            u.setYear(ADUser.getYear());
            u.setPhone(ADUser.getPhone());
            return ADUserRepository.save(u);

        }
        return null;
    }
    public void deleteUser(int id )
    {
        if(!ADUserRepository.existsById(id)){
            throw new RuntimeException("Student not found with id:"+id);

        }
        ADUserRepository.deleteById(id);
    }
    public List<ADUser> getStudentByDepartment(String department)
    {
        return ADUserRepository.findByDepartment(department);
    }
    public List<ADUser> searchStudents(String keyword)
    {
        return ADUserRepository.findByNameContainingIgnoreCaseOrUniversityIdContainingIgnoreCase(keyword,keyword);

    }
    public long getStudentCount()
    {
        return ADUserRepository.countByRole(ADUser.Role.STUDENT);
    }
    public StudentProfileDTO getProfileByEmail(String email) {

        ADUser user = ADUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDTO(user);
    }

    // UPDATE PROFILE BY ID
    public StudentProfileDTO updateProfileByEmail(String email, StudentProfileDTO dto) {

        ADUser user = ADUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setUniversityId(dto.getUniversityId());
        user.setPhone(dto.getPhone());
        user.setDepartment(dto.getDepartment());
        user.setYear(dto.getYear());

        ADUser updated = ADUserRepository.save(user);

        return mapToDTO(updated);
    }


    // MAPPER
    private StudentProfileDTO mapToDTO(ADUser user) {

        StudentProfileDTO dto = new StudentProfileDTO();

        dto.setUniversityId(user.getUniversityId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setDepartment(user.getDepartment());
        dto.setYear(user.getYear());
        dto.setPhone(user.getPhone());
        dto.setEventsRegistered(user.getEventsRegistered());

        if (user.getCreated_at() != null) {
            dto.setCreatedAt(user.getCreated_at()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }

        return dto;
    }
    public void changePasswordByEmail(String email, ChangePasswordDTO dto) {

        ADUser user = ADUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        ADUserRepository.save(user);
    }
}
