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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

        // Create new user with pending approval
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .telephone(request.getTelephone())
                .district(request.getDistrict())
                .sector(request.getSector())
                .role(UserRole.USER)  // Default role for new users
                .isActive(false) // Inactive until approved
                .approved(false) // Requires admin approval
                .emailVerified(false) // Email not verified yet
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered (pending approval): {}", savedUser.getEmail());

        // TODO: Send email verification
        // TODO: Notify admin about new user registration

        return AuthResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .telephone(savedUser.getTelephone())
                .district(savedUser.getDistrict())
                .sector(savedUser.getSector())
                .role(savedUser.getRole())
                .isActive(savedUser.getIsActive())
                .approved(savedUser.getApproved())
                .message("Registration successful! Your account is pending admin approval. You will receive an email once your account is approved.")
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

        // Get the current user (super admin) who is creating this admin
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (currentUser == null || currentUser.getRole() != UserRole.SUPER_ADMIN) {
            throw new RuntimeException("Only super admins can create admin accounts");
        }

        // Create new admin (approved by default when created by super admin)
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
                .approved(true)
                .approvedAt(LocalDateTime.now())
                .approvedBy(currentUser.getEmail())
                .emailVerified(true)
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

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String token) {
        // Remove 'Bearer ' prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Validate token and get email
        String email = jwtUtil.extractEmail(token);
        if (email == null) {
            throw new RuntimeException("Invalid or expired token");
        }

        // Try to find user in each repository
        User user = userRepository.findByEmail(email).orElse(null);
        AdminEntity admin = adminRepository.findByEmail(email).orElse(null);
        SuperAdminEntity superAdmin = superAdminRepository.findByEmail(email).orElse(null);

        // Check which type of user was found and build response
        if (user != null) {
            return buildAuthResponseFromUser(user);
        } else if (admin != null) {
            return buildAuthResponseFromAdmin(admin);
        } else if (superAdmin != null) {
            return buildAuthResponseFromSuperAdmin(superAdmin);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private AuthResponse buildAuthResponseFromUser(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .telephone(user.getTelephone())
                .district(user.getDistrict())
                .sector(user.getSector())
                .role(user.getRole())
                .service(null)
                .message("User details retrieved successfully")
                .build();
    }

    private AuthResponse buildAuthResponseFromAdmin(AdminEntity admin) {
        return AuthResponse.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .telephone(admin.getTelephone())
                .district(admin.getDistrict())
                .sector(admin.getSector())
                .role(admin.getRole())
                .service(admin.getService())
                .message("Admin details retrieved successfully")
                .build();
    }

    private AuthResponse buildAuthResponseFromSuperAdmin(SuperAdminEntity superAdmin) {
        return AuthResponse.builder()
                .id(superAdmin.getId())
                .email(superAdmin.getEmail())
                .fullName(superAdmin.getFullName())
                .telephone(superAdmin.getTelephone())
                .district(superAdmin.getDistrict())
                .sector(superAdmin.getSector())
                .role(superAdmin.getRole())
                .service(null)
                .message("Super Admin details retrieved successfully")
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
            if (admin == null) {
                superAdmin = superAdminRepository.findByEmail(request.getEmail()).orElse(null);
            }
        }

        String email = "";
        String password = "";
        Long id = null;
        String fullName = "";
        String telephone = "";
        String district = "";
        String sector = "";
        UserRole role = null;
        ServiceType service = null;
        boolean isActive = false;
        boolean isApproved = true; // Default to true for admin and super admin

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
            isApproved = user.getApproved();
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
        } else {
            throw new RuntimeException("Invalid email or password");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), password)) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!isActive) {
            throw new RuntimeException("User account is inactive");
        }
        
        // For regular users, check if they are approved
        if (role == UserRole.USER && !isApproved) {
            throw new RuntimeException("Your account is pending admin approval. Please wait for an administrator to approve your account.");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(email, id);
        log.info("User logged in: {}", email);

        // Build and return the response based on user type
        AuthResponse.AuthResponseBuilder responseBuilder;
        if (user != null) {
            responseBuilder = buildAuthResponseFromUser(user).toBuilder();
        } else if (admin != null) {
            responseBuilder = buildAuthResponseFromAdmin(admin).toBuilder();
        } else {
            responseBuilder = buildAuthResponseFromSuperAdmin(superAdmin).toBuilder();
        }
        
        return responseBuilder
                .token(token)
                .message("Login successful")
                .build();
    }
}
