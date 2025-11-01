package com.rwandabill.security;

import com.rwandabill.entity.User;
import com.rwandabill.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("No authenticated user found");
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }

    public boolean isCurrentUserAdmin() {
        User user = getCurrentUser();
        return user.getRole().name().equals("ADMIN") || user.getRole().name().equals("SUPER_ADMIN");
    }

    public boolean isCurrentUserSuperAdmin() {
        User user = getCurrentUser();
        return user.getRole().name().equals("SUPER_ADMIN");
    }
}
