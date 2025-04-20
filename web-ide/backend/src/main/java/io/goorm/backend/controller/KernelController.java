package io.goorm.backend.controller;

import io.goorm.backend.dto.kernel.KernelResponseDto;
import io.goorm.backend.service.KernelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/kernel")
@RequiredArgsConstructor
public class KernelController {
    private final KernelService kernelService;

    @PostMapping("/create")
    public Mono<ResponseEntity<KernelResponseDto>> createKernel(HttpServletRequest request) {
        return kernelService.createKernel()
                .map(ResponseEntity::ok)
                .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new KernelResponseDto(null, "Error: " + error.getMessage()))));
    }
}
