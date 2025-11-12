package com.rwandabill.controller;

import com.rwandabill.dto.AuthResponse;
import com.rwandabill.dto.CreateAdminRequest;
import com.rwandabill.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        try {
            AuthResponse user = userService.getCurrentUser();
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error fetching current user: {}", e.getMessage());
            return ResponseEntity.status(401)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AuthResponse> getUserById(@PathVariable Long userId) {
        try {
            AuthResponse user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error fetching user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(404)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AuthResponse> getUserByEmail(@PathVariable String email) {
        try {
            AuthResponse user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error fetching user by email {}: {}", email, e.getMessage());
            return ResponseEntity.status(404)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<AuthResponse>> getAllUsers() {
        try {
            List<AuthResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            log.error("Error fetching all users: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(List.of(AuthResponse.builder()
                            .message(e.getMessage())
                            .build()));
        }
    }

    @GetMapping("/admins")
    public ResponseEntity<List<AuthResponse>> getAllAdmins() {
        try {
            List<AuthResponse> admins = userService.getAllAdmins();
            return ResponseEntity.ok(admins);
        } catch (RuntimeException e) {
            log.error("Error fetching all admins: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(List.of(AuthResponse.builder()
                            .message(e.getMessage())
                            .build()));
        }
    }

    @PostMapping("/admin")
    public ResponseEntity<AuthResponse> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        try {
            AuthResponse admin = userService.createAdmin(request.getEmail(), request.getPassword(), request.getFullName(), request.getTelephone(), request.getDistrict(), request.getSector());
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            log.error("Error creating admin: {}", e.getMessage());
            return ResponseEntity.status(400)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/super-admin")
    public ResponseEntity<AuthResponse> createSuperAdmin(@Valid @RequestBody CreateAdminRequest request) {
        try {
            AuthResponse superAdmin = userService.createSuperAdmin(request.getEmail(), request.getPassword(), request.getFullName(), request.getTelephone(), request.getDistrict(), request.getSector());
            return ResponseEntity.ok(superAdmin);
        } catch (RuntimeException e) {
            log.error("Error creating super admin: {}", e.getMessage());
            return ResponseEntity.status(400)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }
}
