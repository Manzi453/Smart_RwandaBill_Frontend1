package com.rwandabill.service;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.LoginRequest;
import com.rwandabill.dto.SignupRequest;
import java.util.Arrays;
import java.util.stream.Collectors;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

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
            return AuthResponse.builder()
                    .success(false)
                    .message("Email already registered")
                    .build();
        }

        // Create new user with pending approval
        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .telephone(request.getTelephone().trim())
                .district(request.getDistrict().trim())
                .sector(request.getSector().trim())
                .role(UserRole.USER)
                .isActive(true)
                .approved(true)
                .emailVerified(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered (pending approval): {}", savedUser.getEmail());

        return AuthResponse.builder()
                .success(true)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .telephone(savedUser.getTelephone())
                .district(savedUser.getDistrict())
                .sector(savedUser.getSector())
                .role(savedUser.getRole())
                .isActive(savedUser.getIsActive())
                .approved(savedUser.getApproved())
                .message("Registration successful! Your account has been activated.")
                .build();
    }

    @Transactional
    public AuthResponse signupSuperAdmin(SignupRequest request) {
        log.info("Starting super admin registration for email: {}", request.getEmail());
        
        // Check if super admin already exists
        if (superAdminRepository.count() > 0) {
            log.warn("Super admin already exists");
            return AuthResponse.builder()
                    .success(false)
                    .message("Super admin already exists")
                    .build();
        }

        // Validate required fields
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email is required")
                    .build();
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Password must be at least 6 characters long")
                    .build();
        }
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .build();
        }

        // Create new super admin
        SuperAdminEntity superAdmin = SuperAdminEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .isActive(true)
                .approved(true)
                .emailVerified(true)
                .build();

        SuperAdminEntity savedSuperAdmin = superAdminRepository.save(superAdmin);
        log.info("Super admin created successfully: {}", savedSuperAdmin.getEmail());


        // Generate JWT token
        String token = jwtUtil.generateToken(savedSuperAdmin.getEmail(), savedSuperAdmin.getId());

        return AuthResponse.builder()
                .success(true)
                .id(savedSuperAdmin.getId())
                .email(savedSuperAdmin.getEmail())
                .fullName(savedSuperAdmin.getFullName())
                .telephone(savedSuperAdmin.getTelephone())
                .district(savedSuperAdmin.getDistrict())
                .sector(savedSuperAdmin.getSector())
                .role(savedSuperAdmin.getRole())
                .isActive(true)
                .approved(true)
                .emailVerified(true)
                .token(token)
                .message("Super admin account created successfully")
                .build();
    }

    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuthResponse signupAdmin(SignupRequest request) {
        // Check if admin already exists
        if (adminRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email already registered")
                    .build();
        }

        // Validate service is provided
        if (request.getService() == null || request.getService().trim().isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Service is required for admin registration")
                    .build();
        }

        try {
            // Get the current user (super admin) who is creating this admin
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            if (currentUser == null || currentUser.getRole() != UserRole.SUPER_ADMIN) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Only super admins can create admin accounts")
                        .build();
            }

            // Parse service type
            ServiceType serviceType = ServiceType.valueOf(request.getService().toUpperCase());

            // Create new admin (approved by default when created by super admin)
            AdminEntity admin = AdminEntity.builder()
                    .email(request.getEmail().toLowerCase().trim())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .fullName(request.getFullName().trim())
                    .telephone(request.getTelephone().trim())
                    .district(request.getDistrict().trim())
                    .sector(request.getSector().trim())
                    .role(UserRole.ADMIN)
                    .service(serviceType)
                    .isActive(true)
                    .approved(true)
                    .approvedAt(LocalDateTime.now())
                    .approvedBy(currentUser.getEmail())
                    .emailVerified(true)
                    .build();

            AdminEntity savedAdmin = adminRepository.save(admin);
            log.info("New admin registered: {}", savedAdmin.getEmail());

            return AuthResponse.builder()
                    .success(true)
                    .id(savedAdmin.getId())
                    .email(savedAdmin.getEmail())
                    .fullName(savedAdmin.getFullName())
                    .telephone(savedAdmin.getTelephone())
                    .district(savedAdmin.getDistrict())
                    .sector(savedAdmin.getSector())
                    .role(savedAdmin.getRole())
                    .service(savedAdmin.getService())
                    .isActive(true)
                    .approved(true)
                    .message("Admin registered successfully")
                    .build();
                    
        } catch (IllegalArgumentException e) {
            log.error("Invalid service type: {}", request.getService());
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid service type. Valid values are: " + 
                            String.join(", ", Arrays.stream(ServiceType.values())
                                    .map(Enum::name)
                                    .collect(Collectors.toList())))
                    .build();
        } catch (Exception e) {
            log.error("Error creating admin: {}", e.getMessage(), e);
            return AuthResponse.builder()
                    .success(false)
                    .message("Error creating admin: " + e.getMessage())
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Try to find user in each repository
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        Optional<AdminEntity> admin = adminRepository.findByEmail(request.getEmail());
        Optional<SuperAdminEntity> superAdmin = superAdminRepository.findByEmail(request.getEmail());

        // Check credentials and return appropriate response
        if (user.isPresent() && passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            return buildAuthResponseFromUser(user.get());
        } else if (admin.isPresent() && passwordEncoder.matches(request.getPassword(), admin.get().getPassword())) {
            return buildAuthResponseFromAdmin(admin.get());
        } else if (superAdmin.isPresent() && passwordEncoder.matches(request.getPassword(), superAdmin.get().getPassword())) {
            return buildAuthResponseFromSuperAdmin(superAdmin.get());
        } else {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password")
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid or missing token")
                    .build();
        }

        token = token.substring(7); // Remove 'Bearer ' prefix
        String email = jwtUtil.extractEmail(token);
        
        if (email == null) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid or expired token")
                    .build();
        }

        // Try to find user in each repository
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return buildAuthResponseFromUser(user.get());
        }

        Optional<AdminEntity> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return buildAuthResponseFromAdmin(admin.get());
        }

        Optional<SuperAdminEntity> superAdmin = superAdminRepository.findByEmail(email);
        if (superAdmin.isPresent()) {
            return buildAuthResponseFromSuperAdmin(superAdmin.get());
        }

        return AuthResponse.builder()
                .success(false)
                .message("User not found")
                .build();
    }

    private AuthResponse buildAuthResponseFromUser(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return AuthResponse.builder()
                .success(true)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .telephone(user.getTelephone())
                .district(user.getDistrict())
                .sector(user.getSector())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .approved(user.getApproved())
                .emailVerified(user.getEmailVerified())
                .token(token)
                .message("Login successful")
                .build();
    }

    private AuthResponse buildAuthResponseFromAdmin(AdminEntity admin) {
        String token = jwtUtil.generateToken(admin.getEmail(), admin.getId());
        return AuthResponse.builder()
                .success(true)
                .id(admin.getId())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .telephone(admin.getTelephone())
                .district(admin.getDistrict())
                .sector(admin.getSector())
                .role(admin.getRole())
                .service(admin.getService())
                .isActive(admin.getIsActive())
                .approved(admin.getApproved())
                .emailVerified(admin.getEmailVerified())
                .token(token)
                .message("Login successful")
                .build();
    }

    private AuthResponse buildAuthResponseFromSuperAdmin(SuperAdminEntity superAdmin) {
        String token = jwtUtil.generateToken(superAdmin.getEmail(), superAdmin.getId());
        return AuthResponse.builder()
                .success(true)
                .id(superAdmin.getId())
                .email(superAdmin.getEmail())
                .fullName(superAdmin.getFullName())
                .telephone(superAdmin.getTelephone())
                .district(superAdmin.getDistrict())
                .sector(superAdmin.getSector())
                .role(superAdmin.getRole())
                .isActive(superAdmin.getIsActive())
                .approved(superAdmin.getApproved())
                .emailVerified(superAdmin.getEmailVerified())
                .token(token)
                .message("Login successful")
                .build();
    }
}
