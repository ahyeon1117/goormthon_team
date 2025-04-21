package io.goorm.backend.controller;

import io.goorm.backend.service.KernelService;
import io.goorm.backend.dto.kernel.KernelResponseDTO;
import io.goorm.backend.exception.KernelException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/kernels")
@RequiredArgsConstructor
public class KernelController {

    private final KernelService kernelService;

    @PostMapping
    public Mono<ResponseEntity<KernelResponseDTO>> createKernel(@RequestHeader("Authorization") String authorization) {
        String jwtToken = authorization.split(" ")[1];  // "Bearer <token>"
        log.info("Received kernel creation request for token: {}", jwtToken);

        return kernelService.createKernel(jwtToken)
                .map(ResponseEntity::ok)
                .onErrorResume(KernelException.class, error -> {
                    log.error("Kernel creation failed", error);
                    return Mono.just(ResponseEntity.internalServerError().build());
                });
    }
}

