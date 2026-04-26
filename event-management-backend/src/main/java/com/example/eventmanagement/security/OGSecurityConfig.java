package com.example.eventmanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class OGSecurityConfig {

    @Autowired
    private OGJwtFilter jwtFilter;

    @Bean
    @Order(1)
    public SecurityFilterChain ogSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/events/**", "/api/category/**", "/api/eventRegistrations/**", "/api/announcement/**", "/api/users/**")
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/events/**", "/api/category/**", "/api/eventRegistrations/**", "/api/announcement/**", "/api/users/**").hasAnyRole("ADMIN", "FACULTY")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
