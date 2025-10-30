package com.springboot.rwandabill;

import com.springboot.rwandabill.model.ERole;
import com.springboot.rwandabill.model.Role;
import com.springboot.rwandabill.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class RwandabillApplication {

    public static void main(String[] args) {
        SpringApplication.run(RwandabillApplication.class, args);
    }

    @Bean
    public CommandLineRunner initializeRoles(RoleRepository roleRepository) {
        return args -> {
            // Initialize roles if they don't exist
            if (roleRepository.findByName(ERole.ROLE_SUPERADMIN).isEmpty()) {
                Role superAdminRole = new Role();
                superAdminRole.setName(ERole.ROLE_SUPERADMIN);
                roleRepository.save(superAdminRole);
                System.out.println("Created SUPERADMIN role");
            }
            
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);
                System.out.println("Created ADMIN role");
            }
            
            if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
                Role userRole = new Role();
                userRole.setName(ERole.ROLE_USER);
                roleRepository.save(userRole);
                System.out.println("Created USER role");
            }
        };
    }

}
