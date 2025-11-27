package com.rwandabill.dto;

import lombok.Data;

@Data
public class UserApprovalRequest {
    private boolean approve;
    private String rejectionReason;
}
