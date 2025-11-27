package com.rwandabill.dto;

import com.rwandabill.entity.ServiceType;
import com.rwandabill.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String telephone;
    private String district;
    private String sector;
    private UserRole role;
    private ServiceType service;
    private boolean isActive;
    private boolean approved;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private String approvedBy;
    private String rejectionReason;
    private boolean emailVerified;

    public static UserResponse fromEntity(com.rwandabill.entity.User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .telephone(user.getTelephone())
                .district(user.getDistrict())
                .sector(user.getSector())
                .role(user.getRole())
                .service(user.getService())
                .isActive(user.getIsActive())
                .approved(user.getApproved())
                .createdAt(user.getCreatedAt())
                .approvedAt(user.getApprovedAt())
                .approvedBy(user.getApprovedBy() != null ? user.getApprovedBy().getEmail() : null)
                .rejectionReason(user.getRejectionReason())
                .emailVerified(user.getEmailVerified())
                .build();
    }
}
