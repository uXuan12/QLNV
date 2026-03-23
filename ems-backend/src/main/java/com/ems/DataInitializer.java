package com.ems;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ems.entity.Certificate;
import com.ems.entity.Language;
import com.ems.entity.User;
import com.ems.repository.CertificateRepository;
import com.ems.repository.LanguageRepository;
import com.ems.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository, 
                                         LanguageRepository languageRepository,
                                         CertificateRepository certificateRepository,
                                         PasswordEncoder passwordEncoder) {
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

            // Create sample languages if they don't exist
            if (languageRepository.count() == 0) {
                String[][] languages = {
                    {"English", "Advanced"},
                    {"French", "Intermediate"}, 
                    {"German", "Beginner"},
                    {"Spanish", "Advanced"},
                    {"Chinese", "Intermediate"},
                    {"Japanese", "Beginner"},
                    {"Korean", "Intermediate"}
                };
                for (String[] lang : languages) {
                    Language language = new Language();
                    language.setName(lang[0]);
                    language.setLevel(lang[1]);
                    languageRepository.save(language);
                }
                System.out.println("✓ Sample languages created with levels");
            }

            // Create sample certificates if they don't exist
            if (certificateRepository.count() == 0) {
                String[] certificates = {"AWS Certified Solutions Architect", "Google Cloud Professional", 
                                       "Microsoft Azure Fundamentals", "Cisco CCNA", "CompTIA A+", 
                                       "PMP Certification", "Scrum Master"};
                for (String cert : certificates) {
                    Certificate certificate = new Certificate();
                    certificate.setName(cert);
                    certificateRepository.save(certificate);
                }
                System.out.println("✓ Sample certificates created: " + String.join(", ", certificates));
            }
        };
    }
}
