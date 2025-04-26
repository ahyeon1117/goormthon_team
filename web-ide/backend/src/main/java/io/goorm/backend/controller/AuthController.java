
package io.goorm.backend.controller;

import io.goorm.backend.dto.auth.LoginRequest;
import io.goorm.backend.dto.auth.LoginResponse;
import io.goorm.backend.dto.auth.SignUpRequest;
import io.goorm.backend.dto.auth.SignUpResponse;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.response.ApiResponse;
import io.goorm.backend.service.UserService;
import io.goorm.backend.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 컨트롤러
 * 회원가입과 로그인을 처리한다.
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "인증 API")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * 회원가입 API
     * @param signUpRequest 회원가입 요청 DTO
     * @return 회원가입 응답 DTO
     */
    @PostMapping("/signup") // api는 소문자로 작성
    @Operation(summary = "회원가입", description = "회원가입 요청을 받아 사용자를 등록합니다.")
    public ResponseEntity<ApiResponse<SignUpResponse>> signUp(@RequestBody @Valid SignUpRequest signUpRequest) {
        // 회원가입 서비스 호출 결과
        User user = authService.signUp(signUpRequest.toServiceDto());

        // 응답 DTO 생성
        SignUpResponse response = new SignUpResponse(user.getId(), user.getUsername(), user.getEmail());

        // 응답 반환
        return ResponseEntity.ok(ApiResponse.success(response, "회원가입이 완료되었습니다."));
    }

    /**
     * 로그인 API
     * @param loginRequest 로그인 요청 DTO
     * @return 로그인 응답 DTO
     */
    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호를 이용해 로그인하고, JWT 토큰을 발급하여 반환합니다.")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
        // 로그인 서비스 호출 결과 (JWT 토큰)
        String token = authService.login(loginRequest);
        
        // 이메일로 사용자 조회
        User user = userService.findByEmail(loginRequest.getEmail());

        // 응답 DTO 생성
        LoginResponse response = new LoginResponse(user.getId(), token, user.getUsername());

        // 응답 반환
        return ResponseEntity.ok(ApiResponse.success(response, "로그인이 완료되었습니다."));
    }

    /**
     * 로그아웃 API
     * @param bearerToken 요청 헤더에 포함된 Bearer 토큰
     */
    @DeleteMapping("/logout")
    @Operation(summary = "로그아웃", description = "로그아웃 요청을 받아 사용자의 토큰을 무효화합니다.")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String bearerToken) {
        // Bearer 접두사 제거
        String accessToken = bearerToken.substring("Bearer ".length());

        // 비즈니스 로직 호출
        authService.logout(accessToken);

        return ResponseEntity.ok(ApiResponse.success(null, "로그아웃이 완료되었습니다."));
    }
}
