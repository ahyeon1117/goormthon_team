package io.goorm.backend.service;

import io.goorm.backend.dto.kernel.KernelResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KernelService {
    private final WebClient webClient;
    private static final String KG_AUTH_TOKEN = "rocket";

    public Mono<KernelResponseDto> createKernel() {
        return webClient.post()
                .uri("http://localhost:8888/api/kernels")
                .header("Authorization", "token " + KG_AUTH_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(error -> Mono.error(new RuntimeException("Kernel error: " + error)))
                )
                .bodyToMono(KernelResponseDto.class);
    }
}
