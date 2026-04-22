package com.example.eventmanagement.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
 
@Profile("!test")
public class DataInitializer implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        // Intentionally disabled.
        // This initializer is kept for future use but does not execute any startup logic.
    }
}
