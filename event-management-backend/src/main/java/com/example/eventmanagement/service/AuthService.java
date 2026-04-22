package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.LoginResponse;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.security.JwtTokenProvider;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) throws Exception {
        String normalizedEmail = request.getEmail() == null
            ? ""
            : request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new Exception("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new Exception("Invalid password");
        }

        if (!user.getActive()) {
            throw new Exception("User account is inactive");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());

        return LoginResponse.builder()
                .token(token)
            .user(LoginResponse.UserInfo.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .registrationNumber(user.getRegistrationNumber())
                .build())
                .build();
    }

    public void register(String email, String password, String fullName, String registrationNumber, UserRole role) throws Exception {
        String normalizedEmail = email == null
                ? ""
                : email.trim().toLowerCase();

        if (normalizedEmail.isBlank()) {
            throw new Exception("Email is required");
        }

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new Exception("Email already registered");
        }

        User user = User.builder()
                .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .registrationNumber(registrationNumber)
                .role(role)
                .active(true)
                .build();

        userRepository.save(user);
    }
}
