package com.rwandabill.controller;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.SignupRequest;
import com.rwandabill.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/superadmin")
@RequiredArgsConstructor
@Slf4j
public class SuperAdminController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupSuperAdmin(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signupSuperAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Super admin signup error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Super Admin API is running");
    }
}
