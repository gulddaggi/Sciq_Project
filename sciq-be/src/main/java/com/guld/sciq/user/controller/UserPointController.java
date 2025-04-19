package com.guld.sciq.user.controller;

import com.guld.sciq.user.dto.UserPointResponseDto;
import com.guld.sciq.user.entity.User;
import com.guld.sciq.user.service.UserPointService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/points")
@RequiredArgsConstructor
public class UserPointController {
    private final UserPointService userPointService;

    /**
     * 사용자의 포인트 정보 조회
     */
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER') and (authentication.principal.id == #userId or hasRole('ADMIN'))")
    public ResponseEntity<UserPointResponseDto> getUserPointInfo(@PathVariable Long userId) {
        User user = userPointService.getUserPointInfo(userId);
        return ResponseEntity.ok(new UserPointResponseDto(user.getPoints(), user.getLevel()));
    }
} 