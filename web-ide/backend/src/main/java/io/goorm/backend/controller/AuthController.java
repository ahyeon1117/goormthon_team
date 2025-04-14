package io.goorm.backend.controller;

import io.goorm.backend.dto.auth.SignUpRequest;
import io.goorm.backend.dto.common.ApiResponse;
import io.goorm.backend.entity.User;
import io.goorm.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    /**
     * 회원가입 API
     * @param signUpRequest 회원가입 요청 DTO
     * @return 회원가입 응답 DTO
     */
    @PostMapping("/signup") // api는 소문자로 작성
    public ResponseEntity<ApiResponse<User>> signUp(@RequestBody @Valid SignUpRequest signUpRequest) {
        
        // 회원가입 서비스 호출 결과
        User user = authService.signUp(signUpRequest.toServiceDto());

        // 응답 반환
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
