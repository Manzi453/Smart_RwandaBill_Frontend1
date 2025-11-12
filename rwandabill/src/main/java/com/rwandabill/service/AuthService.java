package com.rwandabill.service;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.LoginRequest;
import com.rwandabill.dto.SignupRequest;
import com.rwandabill.entity.User;
import com.rwandabill.entity.UserRole;
import com.rwandabill.repository.UserRepository;
import com.rwandabill.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .role(UserRole.USER)  // Default role for new users
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        return AuthResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .telephone(savedUser.getTelephone())
                .district(savedUser.getDistrict())
                .sector(savedUser.getSector())
                .role(savedUser.getRole())
                .service(savedUser.getService())
                .message("User registered successfully")
                .build();
    }

    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuthResponse signupAdmin(SignupRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new admin
        User admin = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .role(UserRole.ADMIN)
                .isActive(true)
                .build();

        User savedAdmin = userRepository.save(admin);
        log.info("New admin registered: {}", savedAdmin.getEmail());

        return AuthResponse.builder()
                .id(savedAdmin.getId())
                .email(savedAdmin.getEmail())
                .fullName(savedAdmin.getFullName())
                .telephone(savedAdmin.getTelephone())
                .district(savedAdmin.getDistrict())
                .sector(savedAdmin.getSector())
                .role(savedAdmin.getRole())
                .service(savedAdmin.getService())
                .message("Admin registered successfully")
                .build();
    }

    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuthResponse signupSuperAdmin(SignupRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new super admin
        User superAdmin = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .role(UserRole.SUPER_ADMIN)
                .isActive(true)
                .build();

        User savedSuperAdmin = userRepository.save(superAdmin);
        log.info("New super admin registered: {}", savedSuperAdmin.getEmail());

        return AuthResponse.builder()
                .id(savedSuperAdmin.getId())
                .email(savedSuperAdmin.getEmail())
                .fullName(savedSuperAdmin.getFullName())
                .telephone(savedSuperAdmin.getTelephone())
                .district(savedSuperAdmin.getDistrict())
                .sector(savedSuperAdmin.getSector())
                .role(savedSuperAdmin.getRole())
                .service(savedSuperAdmin.getService())
                .message("Super admin registered successfully")
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("User account is inactive");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .telephone(user.getTelephone())
                .district(user.getDistrict())
                .sector(user.getSector())
                .role(user.getRole())
                .service(user.getService())
                .token(token)
                .message("Login successful")
                .build();
    }
}
