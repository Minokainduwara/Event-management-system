package com.example.eventmanagement.services;

import com.example.eventmanagement.model.OGUser;
import com.example.eventmanagement.repository.OGUserRepository;
import com.example.eventmanagement.dto.OGChangePasswordDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OGUserService {

    @Autowired
    private OGUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<OGUser> getProfile(String email) {
        return userRepository.findByEmail(email);
    }

    public OGUser updateProfile(String email, OGUser updatedUser) {
        OGUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setDepartment(updatedUser.getDepartment());
        user.setYear(updatedUser.getYear());
        return userRepository.save(user);
    }

    public boolean changePassword(String email, OGChangePasswordDto dto) {
        OGUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        return true;
    }
}
