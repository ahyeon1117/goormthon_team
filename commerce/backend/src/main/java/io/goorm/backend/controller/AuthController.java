package io.goorm.backend.controller;

import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.UserResponseDto;
import io.goorm.backend.dto.security.SignInDto;
import io.goorm.backend.dto.security.SignUpDto;
import io.goorm.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> signIn(
        @RequestBody SignInDto signInDto
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                authService.signIn(
                    signInDto.getUserId(),
                    signInDto.getPassword()
                )
            )
        );
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<UserResponseDto>> signUp(
        @RequestBody SignUpDto signUpDto
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(authService.signUp(signUpDto.toService()))
        );
    }
}
