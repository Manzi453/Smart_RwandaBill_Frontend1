package com.rwandabill.entity;

import com.rwandabill.entity.ServiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraph(
    name = "user-with-approval",
    attributeNodes = @NamedAttributeNode("approvedBy")
)
public class User {

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
    private UserRole role = UserRole.USER; // Always USER for this entity

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private ServiceType service;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private Boolean approved = false;
    
    @Column(nullable = true)
    private LocalDateTime approvedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @Column(length = 500, nullable = true)
    private String rejectionReason;
    
    @Column(nullable = false)
    private Boolean emailVerified = false;
    
    @Column(name = "verification_token", length = 64, nullable = true)
    private String verificationToken;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = false; // Users are inactive until approved
        approved = false; // Explicitly set to false for new users
        if (role == null) {
            role = UserRole.USER;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
