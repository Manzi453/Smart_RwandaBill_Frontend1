package com.rwandabill.service;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.entity.User;
import com.rwandabill.entity.UserRole;
import com.rwandabill.repository.UserRepository;
import com.rwandabill.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser() {
        User user = securityUtil.getCurrentUser();
        return convertToAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToAuthResponse(user);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public List<AuthResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToAuthResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<AuthResponse> getAllAdmins() {
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);
        List<User> superAdmins = userRepository.findByRole(UserRole.SUPER_ADMIN);
        admins.addAll(superAdmins);
        return admins.stream()
                .map(this::convertToAuthResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuthResponse createAdmin(String email, String password, String fullName, String telephone, String district, String sector) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User admin = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .telephone(telephone)
                .district(district)
                .sector(sector)
                .role(UserRole.ADMIN)
                .isActive(true)
                .build();

        User savedAdmin = userRepository.save(admin);
        log.info("New admin created: {}", savedAdmin.getEmail());

        return convertToAuthResponse(savedAdmin);
    }

    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuthResponse createSuperAdmin(String email, String password, String fullName, String telephone, String district, String sector) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User superAdmin = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .telephone(telephone)
                .district(district)
                .sector(sector)
                .role(UserRole.SUPER_ADMIN)
                .isActive(true)
                .build();

        User savedSuperAdmin = userRepository.save(superAdmin);
        log.info("New super admin created: {}", savedSuperAdmin.getEmail());

        return convertToAuthResponse(savedSuperAdmin);
    }

    private AuthResponse convertToAuthResponse(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .telephone(user.getTelephone())
                .district(user.getDistrict())
                .sector(user.getSector())
                .role(user.getRole())
                .service(user.getService())
                .build();
    }
}
