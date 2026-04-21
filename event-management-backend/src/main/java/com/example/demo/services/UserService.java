package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.repository.EventRegistrationRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }
    public List<User> getAllStudents(){
        List<User> students=userRepository.findByRole(User.Role.STUDENT);
        for(User user:students){
            int count= eventRegistrationRepository.countByUser_UserId(user.getUserId());
            user.setEventsRegistered(count);
        }
        return students;
    }
    public User getUserById(int id){
        return userRepository.findById(id).orElse(null);
    }
    public User updateUser(int id,User user){
        User u=userRepository.findById(id).orElse(null);
        if(u!=null){
            u.setName(user.getName());
            u.setEmail(user.getEmail());
            u.setPassword(user.getPassword());
            u.setRole(user.getRole());
            u.setUniversityId(user.getUniversityId());
            u.setDepartment(user.getDepartment());
            u.setYear(user.getYear());
            u.setPhone(user.getPhone());
            return userRepository.save(u);

        }
        return null;
    }
    public void deleteUser(int id )
    {
        if(!userRepository.existsById(id)){
            throw new RuntimeException("Student not found with id:"+id);

        }
        userRepository.deleteById(id);
    }
    public List<User> getStudentByDepartment(String department)
    {
        return userRepository.findByDepartment(department);
    }
    public List<User> searchStudents(String keyword)
    {
        return userRepository.findByNameContainingIgnoreCaseOrUniversityIdContainingIgnoreCase(keyword,keyword);

    }
    public long getStudentCount()
    {
        return userRepository.countByRole(User.Role.STUDENT);
    }

}
