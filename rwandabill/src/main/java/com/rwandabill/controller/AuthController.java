package com.rwandabill.controller;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.LoginRequest;
import com.rwandabill.dto.SignupRequest;
import com.rwandabill.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(
    path = "/auth",
    produces = MediaType.APPLICATION_JSON_VALUE,
    consumes = MediaType.APPLICATION_JSON_VALUE
)
@CrossOrigin(origins = {
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
}, 
allowCredentials = "true", 
allowedHeaders = "*",
methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    private final AuthService authService;

    @PostMapping(value = {"/signup", "/signup/"})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Received signup request for user: {}", request.getEmail());
        try {
            // Basic validation
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }
            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                throw new IllegalArgumentException("Full name is required");
            }
            
            AuthResponse response = authService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Validation error in user registration: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (RuntimeException e) {
            log.error("User signup error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message("Failed to create user: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping(value = {"/signup/super-admin", "/signup/super-admin/"})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AuthResponse> signupSuperAdmin(@Valid @RequestBody SignupRequest request) {
        log.info("Received signup request for super admin: {}", request.getEmail());
        try {
            // Basic validation
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }
            
            AuthResponse response = authService.signupSuperAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Validation error in super admin registration: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (RuntimeException e) {
            log.error("Super Admin signup error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message("Failed to create super admin: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping(value = {"/signup/admin", "/signup/admin/"})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AuthResponse> signupAdmin(@Valid @RequestBody SignupRequest request) {
        log.info("Received signup request for admin: {}", request.getEmail());
        try {
            // Basic validation
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }
            if (request.getService() == null || request.getService().trim().isEmpty()) {
                throw new IllegalArgumentException("Service is required for admin registration");
            }
            
            AuthResponse response = authService.signupAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Validation error in admin registration: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (RuntimeException e) {
            log.error("Admin signup error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message("Failed to create admin: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend is running");
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint is accessible");
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            AuthResponse response = authService.getCurrentUser(token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error fetching current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

}
