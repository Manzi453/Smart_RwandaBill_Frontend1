package com.rwandabill.service;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.UserApprovalRequest;
import com.rwandabill.dto.UserResponse;
import com.rwandabill.entity.User;
import com.rwandabill.entity.UserRole;
import com.rwandabill.exception.ResourceNotFoundException;
import com.rwandabill.repository.UserRepository;
import com.rwandabill.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    public Page<UserResponse> findPendingApprovals(Pageable pageable) {
        return userRepository.findByApprovedFalseAndRole(UserRole.USER, pageable)
                .map(UserResponse::fromEntity);
    }
    
    @Transactional
    public UserResponse updateUserApprovalStatus(Long userId, UserApprovalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (request.isApprove()) {
            user.setApproved(true);
            user.setApprovedAt(LocalDateTime.now());
            user.setApprovedBy(currentUser);
            user.setIsActive(true);
            user.setRejectionReason(null);
            log.info("User {} approved by admin {}", user.getEmail(), currentUser.getEmail());
            
            // TODO: Send approval email to user
        } else {
            user.setApproved(false);
            user.setApprovedAt(null);
            user.setApprovedBy(null);
            user.setIsActive(false);
            user.setRejectionReason(request.getRejectionReason());
            log.info("User {} rejected by admin {}", user.getEmail(), currentUser.getEmail());
            
            // TODO: Send rejection email to user with reason
        }
        
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }
    
    @Transactional(readOnly = true)
    public UserResponse getUserApprovalStatus(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser() {
        String email = securityUtil.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public List<AuthResponse> getAllUsers() {
        List<User> users = userRepository.findByRole(UserRole.USER);
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

    @Transactional(readOnly = true)
    public AuthResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToAuthResponse(user);
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
