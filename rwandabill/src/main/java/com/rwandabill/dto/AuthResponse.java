package com.rwandabill.dto;

import com.rwandabill.entity.UserRole;
import com.rwandabill.entity.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AuthResponse {

    private Long id;
    private String email;
    private String fullName;
    private String telephone;
    private String district;
    private String sector;
    private UserRole role;
    private ServiceType service;
    private String token;
    private String message;
    private Boolean isActive;
    private Boolean approved;
    private LocalDateTime approvedAt;
    private String approvedBy;
    private String rejectionReason;
    private Boolean emailVerified;
}
