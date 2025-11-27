package com.rwandabill.controller;

import com.rwandabill.dto.UserApprovalRequest;
import com.rwandabill.dto.UserResponse;
import com.rwandabill.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-approvals")
@RequiredArgsConstructor
@Slf4j
public class UserApprovalController {

    private final UserService userService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<UserResponse>> getPendingApprovals(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.findPendingApprovals(pageable));
    }

    @PutMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> updateUserApprovalStatus(
            @PathVariable Long userId,
            @RequestBody UserApprovalRequest approvalRequest) {
        return ResponseEntity.ok(userService.updateUserApprovalStatus(userId, approvalRequest));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> getUserApprovalStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserApprovalStatus(userId));
    }
}
