package com.rwandabill.service;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.entity.User;
import com.rwandabill.repository.UserRepository;
import com.rwandabill.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

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
