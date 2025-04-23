package io.goorm.backend.controller;

import io.goorm.backend.dto.user.UserProfileResponse;
import io.goorm.backend.dto.user.UserUpdateRequest;
import io.goorm.backend.global.response.ApiResponse;
import io.goorm.backend.service.JwtService;
import io.goorm.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@Tag(name = "User", description = "사용자 API")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    /**
     * 내 회원 정보 조회
     */
    @GetMapping("/me")
    @Operation(summary = "사용자 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile() {
        
        // 현재 로그인한 사용자의 userId 조회
        Long userId = jwtService.getUserId();
        
        // 사용자 정보 조회
        UserProfileResponse response = userService.getUserProfile(userId);

        // 응답 반환
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 타인 회원 정보 조회
     */
    @GetMapping("/{userId}")
    @Operation(summary = "타인 회원 정보 조회", description = "특정 사용자의 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(@PathVariable Long userId) {
        
        UserProfileResponse response = userService.getUserProfile(userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 회원 정보 수정
     */
    @PatchMapping("/me")
    @Operation(summary = "회원 정보 수정", description = "현재 로그인한 사용자의 정보를 수정합니다.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(@Valid @RequestBody UserUpdateRequest request) {
        
        // 현재 로그인한 사용자의 userId 조회
        Long userId = jwtService.getUserId();

        // 회원 정보 수정
        UserProfileResponse response = userService.updateUserProfile(userId, request);

        // 응답 반환
        return ResponseEntity.ok(ApiResponse.success(response, "회원 정보가 수정되었습니다."));
    }
}