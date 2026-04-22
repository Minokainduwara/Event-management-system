package com.example.eventmanagement.services;

import com.example.eventmanagement.model.ADUser;
import com.example.eventmanagement.repository.ADEventRegistrationRepository;
import com.example.eventmanagement.repository.ADUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ADUserService {
    @Autowired
    private ADUserRepository ADUserRepository;
    @Autowired
    private ADEventRegistrationRepository ADEventRegistrationRepository;

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

}
