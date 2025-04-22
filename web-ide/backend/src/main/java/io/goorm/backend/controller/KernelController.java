package io.goorm.backend.controller;

import io.goorm.backend.service.JwtService;
import io.goorm.backend.service.KernelService;
import io.goorm.backend.dto.kernel.KernelResponseDTO;
import io.goorm.backend.exception.KernelException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/kernels")
@RequiredArgsConstructor
@Tag(name = "Kernel", description = "fastapi 커널 생성 요청 API")
public class KernelController {

    private final KernelService kernelService;
    private final JwtService jwtService;


    @PostMapping
    public Mono<ResponseEntity<KernelResponseDTO>> createKernel(@RequestHeader("Authorization") String authorization) {
        // 토큰 형식 검증 및 Bearer 접두사 제거
        String token = authorization;
        if (authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
        }

        try {
            // 토큰 검증 및 사용자 ID 추출
            Long userId = jwtService.getUserId(token);

            // 이후 서비스 호출은 token(Authorization 헤더)만 전달하고 jwtService.getUserId() 호출에 의존하지 않음
            return kernelService.createKernelWithUserId(userId, authorization)
                    .map(ResponseEntity::ok)
                    .onErrorResume(KernelException.class, error -> {
                        log.error("Kernel creation failed", error);
                        return Mono.just(ResponseEntity.internalServerError().build());
                    });
        } catch (Exception e) {
            log.error("인증 오류", e);
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        }
    }

//    @PostMapping
//    @Operation(summary = "커널 생성 요청", description = "사용자의 새 커널을 생성합니다.")
//    public Mono<ResponseEntity<KernelResponseDTO>> createKernel() {
//                return kernelService.createKernel()
//                .map(ResponseEntity::ok)
//                .onErrorResume(KernelException.class, error -> {
//                    log.error("Kernel creation failed", error);
//                    return Mono.just(ResponseEntity.internalServerError().build());
//                });
//
//    };

//    @PostMapping
//    public Mono<ResponseEntity<KernelResponseDTO>> createKernel(@RequestHeader("Authorization") String authorization) {
//                return kernelService.createKernel(authorization)
//                .map(ResponseEntity::ok)
//                .onErrorResume(KernelException.class, error -> {
//                    log.error("Kernel creation failed", error);
//                    return Mono.just(ResponseEntity.internalServerError().build());
//                });
//
//    };

//    @PostMapping
//    public Mono<ResponseEntity<KernelResponseDTO>> createKernel(Authentication authentication) {
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//        Long userId = userDetails.getUser().getId();
//
//        return kernelService.createKernel(userId)
//                .map(ResponseEntity::ok)
//                .onErrorResume(KernelException.class, error -> {
//                    log.error("Kernel creation failed", error);
//                    return Mono.just(ResponseEntity.internalServerError().build());
//                });
//    }

}

