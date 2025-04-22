package io.goorm.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.dto.kernel.KernelResponseDTO;
import io.goorm.backend.dto.kernel.KernelRequestDTO;
import io.goorm.backend.exception.KernelException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ClientResponse;
import reactor.core.publisher.Mono;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class KernelService {

    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    @Qualifier("myWebClient")
//    @Autowired
    private  final WebClient webClient;

    private static final String API_PATH = "/api/kernels";


    public Mono<KernelResponseDTO> createKernel(String jwtToken) {
        Long userId = jwtService.getUserId();
        log.info("Creating kernel with user_id: {}", userId);
//
//        KernelRequestDTO requestDTO = new KernelRequestDTO(userId);

        return webClient.post()
                .uri(API_PATH)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.AUTHORIZATION, jwtToken)
                .exchangeToMono(response -> {
                    log.info("📦 응답 상태 코드: {}", response.statusCode());

                    return response.bodyToMono(String.class) // 임시로 String으로만 읽기
                            .doOnNext(raw -> log.info("📦 응답 바디 원문: {}", raw))
                            .flatMap(raw -> {
                                try {
                                    ObjectMapper mapper = new ObjectMapper();
                                    KernelResponseDTO dto = mapper.readValue(raw, KernelResponseDTO.class);
                                    return Mono.just(dto);
                                } catch (Exception e) {
                                    log.error("❌ JSON 디코딩 실패", e);
                                    return Mono.error(e);
                                }
                            });
                });
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
