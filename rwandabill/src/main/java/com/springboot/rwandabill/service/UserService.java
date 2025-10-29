package com.springboot.rwandabill.service;

import com.springboot.rwandabill.exception.ResourceAlreadyExistsException;
import com.springboot.rwandabill.exception.ResourceNotFoundException;
import com.springboot.rwandabill.model.ERole;
import com.springboot.rwandabill.model.Role;
import com.springboot.rwandabill.model.User;
import com.springboot.rwandabill.payload.request.SignupRequest;
import com.springboot.rwandabill.repository.RoleRepository;
import com.springboot.rwandabill.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    public void registerUser(SignupRequest signUpRequest) {
        // Check if username is already taken
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new ResourceAlreadyExistsException("User", "username", signUpRequest.getUsername());
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("User", "email", signUpRequest.getEmail());
        }

        try {
            // Create new user's account
            User user = new User(
                    signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()),
                    signUpRequest.getFullName()
            );

            // Process roles
            Set<Role> roles = processRoles(signUpRequest.getRoles());
            user.setRoles(roles);
            
            // Save the user
            userRepository.save(user);
            
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e.getMessage(), e);
        }
    }
    
    private Set<Role> processRoles(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();
        
        if (strRoles == null || strRoles.isEmpty()) {
            // Default role is USER if no role is specified
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_USER"));
            roles.add(userRole);
            return roles;
        }
        
        // Process each specified role
        for (String role : strRoles) {
            Role userRole = switch (role.toLowerCase()) {
                case "superadmin" -> roleRepository.findByName(ERole.ROLE_SUPERADMIN)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_SUPERADMIN"));
                case "admin" -> roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_ADMIN"));
                case "user" -> roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_USER"));
                default -> throw new ResourceNotFoundException("Role", "name", role);
            };
            roles.add(userRole);
        }
        
        return roles;
    }
}
