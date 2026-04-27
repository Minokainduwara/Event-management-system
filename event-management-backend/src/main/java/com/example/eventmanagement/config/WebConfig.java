package com.example.eventmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 🔴 FIX: stable absolute path inside project
        String uploadPath = Paths.get(System.getProperty("user.dir"), "uploads")
                .toUri()
                .toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}