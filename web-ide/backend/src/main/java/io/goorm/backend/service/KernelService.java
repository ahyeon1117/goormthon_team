package io.goorm.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.dto.kernel.KernelResponseDTO;
import io.goorm.backend.exception.KernelException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ClientResponse;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class KernelService {
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private static final String API_PATH = "/api/kernels";

    public Mono<KernelResponseDTO> createKernel(String jwtToken) {
        log.info("Creating kernel with JWT token: {}", jwtToken);

        return webClient.post()
                .uri(API_PATH)
                .header("Authorization", createAuthorizationHeader(jwtToken))
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .bodyToMono(String.class)
                .map(this::convertToKernelResponse)
                .doOnSuccess(this::logSuccess)
                .doOnError(this::logError);
    }

    private String createAuthorizationHeader(String jwtToken) {
        return "Bearer " + jwtToken;
    }

    private Mono<? extends Throwable> handleError(ClientResponse clientResponse) {
        return clientResponse.bodyToMono(String.class)
                .flatMap(errorBody -> {
                    String errorMessage = String.format("Kernel creation failed with status %s: %s",
                            clientResponse.statusCode(), errorBody);
                    log.error(errorMessage);
                    return Mono.error(new KernelException(errorMessage));
                });
    }

    private KernelResponseDTO convertToKernelResponse(String jsonString) {
        try {
            return objectMapper.readValue(jsonString, KernelResponseDTO.class);
        } catch (Exception e) {
            String errorMessage = "Failed to parse kernel response";
            log.error("{}: {}", errorMessage, jsonString, e);
            throw new KernelException(errorMessage, e);
        }
    }

    private void logSuccess(KernelResponseDTO response) {
        log.info("Kernel created successfully: {}", response);
    }

    private void logError(Throwable error) {
        log.error("Failed to create kernel", error);
    }
}
