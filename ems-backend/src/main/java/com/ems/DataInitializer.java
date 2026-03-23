package com.ems;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ems.entity.User;
import com.ems.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default test users if they don't exist
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin@123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✓ Admin user created: admin / admin@123");
            }

            if (userRepository.findByUsername("user").isEmpty()) {
                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("user@123"));
                user.setRole("USER");
                userRepository.save(user);
                System.out.println("✓ Regular user created: user / user@123");
            }
        };
    }
}
