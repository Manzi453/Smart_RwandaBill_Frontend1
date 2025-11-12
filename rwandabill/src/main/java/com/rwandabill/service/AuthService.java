package com.rwandabill.service;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.LoginRequest;
import com.rwandabill.dto.SignupRequest;
import com.rwandabill.entity.User;
import com.rwandabill.entity.AdminEntity;
import com.rwandabill.entity.SuperAdminEntity;
import com.rwandabill.entity.UserRole;
import com.rwandabill.entity.ServiceType;
import com.rwandabill.repository.UserRepository;
import com.rwandabill.repository.AdminRepository;
import com.rwandabill.repository.SuperAdminRepository;
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
    private final AdminRepository adminRepository;
    private final SuperAdminRepository superAdminRepository;
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
                .message("User registered successfully")
                .build();
    }

    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuthResponse signupAdmin(SignupRequest request) {
        // Check if admin already exists
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Validate service is provided
        if (request.getService() == null) {
            throw new RuntimeException("Service is required for admin registration");
        }

        // Create new admin
        AdminEntity admin = AdminEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .role(UserRole.ADMIN)
                .service(ServiceType.valueOf(request.getService().toUpperCase()))
                .isActive(true)
                .build();

        AdminEntity savedAdmin = adminRepository.save(admin);
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
        // Check if super admin already exists
        if (superAdminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new super admin
        SuperAdminEntity superAdmin = SuperAdminEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .role(UserRole.SUPER_ADMIN)
                .isActive(true)
                .build();

        SuperAdminEntity savedSuperAdmin = superAdminRepository.save(superAdmin);
        log.info("New super admin registered: {}", savedSuperAdmin.getEmail());

        return AuthResponse.builder()
                .id(savedSuperAdmin.getId())
                .email(savedSuperAdmin.getEmail())
                .fullName(savedSuperAdmin.getFullName())
                .telephone(savedSuperAdmin.getTelephone())
                .district(savedSuperAdmin.getDistrict())
                .sector(savedSuperAdmin.getSector())
                .role(savedSuperAdmin.getRole())
                .message("Super admin registered successfully")
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Find user by email in any repository
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        AdminEntity admin = null;
        SuperAdminEntity superAdmin = null;

        if (user == null) {
            admin = adminRepository.findByEmail(request.getEmail()).orElse(null);
        }
        if (user == null && admin == null) {
            superAdmin = superAdminRepository.findByEmail(request.getEmail()).orElse(null);
        }

        if (user == null && admin == null && superAdmin == null) {
            throw new RuntimeException("Invalid email or password");
        }

        String password = "";
        Long id = null;
        String email = "";
        String fullName = "";
        String telephone = "";
        String district = "";
        String sector = "";
        UserRole role = null;
        ServiceType service = null;
        Boolean isActive = false;

        if (user != null) {
            password = user.getPassword();
            id = user.getId();
            email = user.getEmail();
            fullName = user.getFullName();
            telephone = user.getTelephone();
            district = user.getDistrict();
            sector = user.getSector();
            role = user.getRole();
            isActive = user.getIsActive();
        } else if (admin != null) {
            password = admin.getPassword();
            id = admin.getId();
            email = admin.getEmail();
            fullName = admin.getFullName();
            telephone = admin.getTelephone();
            district = admin.getDistrict();
            sector = admin.getSector();
            role = admin.getRole();
            service = admin.getService();
            isActive = admin.getIsActive();
        } else if (superAdmin != null) {
            password = superAdmin.getPassword();
            id = superAdmin.getId();
            email = superAdmin.getEmail();
            fullName = superAdmin.getFullName();
            telephone = superAdmin.getTelephone();
            district = superAdmin.getDistrict();
            sector = superAdmin.getSector();
            role = superAdmin.getRole();
            isActive = superAdmin.getIsActive();
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), password)) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!isActive) {
            throw new RuntimeException("User account is inactive");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(email, id);
        log.info("User logged in: {}", email);

        return AuthResponse.builder()
                .id(id)
                .email(email)
                .fullName(fullName)
                .telephone(telephone)
                .district(district)
                .sector(sector)
                .role(role)
                .service(service)
                .token(token)
                .message("Login successful")
                .build();
    }
}
