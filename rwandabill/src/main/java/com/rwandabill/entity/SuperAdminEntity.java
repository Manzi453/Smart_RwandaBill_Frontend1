package com.rwandabill.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "superadmins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperAdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String sector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.SUPER_ADMIN; // Always SUPER_ADMIN for this entity

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private Boolean approved;

    @Column(nullable = false)
    private Boolean emailVerified;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = true;
        approved = true; // Super admins are auto-approved
        emailVerified = true; // Consider sending verification email in production
        if (role == null) {
            role = UserRole.SUPER_ADMIN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
