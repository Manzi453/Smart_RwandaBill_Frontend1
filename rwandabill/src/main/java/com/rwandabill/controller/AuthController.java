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

    @PostMapping("/signup/super-admin")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AuthResponse> signupSuperAdmin(@Valid @RequestBody SignupRequest request) {
        log.info("Received signup request for super admin: {}", request.getEmail());
        try {
            AuthResponse response = authService.signupSuperAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Super Admin signup error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
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
