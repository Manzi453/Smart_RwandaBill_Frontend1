package com.rwandabill.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminEntity {

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
    private UserRole role = UserRole.ADMIN; // Always ADMIN for this entity

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceType service; // Required for admins

    @Column(nullable = false)
    private Boolean isActive;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(nullable = false)
    private Boolean approved = false;
    
    private LocalDateTime approvedAt;
    
    private String approvedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = true;
        if (role == null) {
            role = UserRole.ADMIN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
