package io.goorm.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.dto.kernel.KernelRequestDTO;
import io.goorm.backend.dto.kernel.KernelResponseDTO;
import io.goorm.backend.exception.KernelException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ClientResponse;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class KernelService {

    private final ObjectMapper objectMapper;
    private final JwtService jwtService;       // 토큰에서 직접 userId 추출
    @Qualifier("myWebClient")
    private final WebClient webClient;


    private static final String API_PATH = "/api/kernels";

    public Mono<KernelResponseDTO> createKernelWithUserId(Long userId, String authorizationHeader) {
        log.info("Creating kernel with user_id: {}", userId);

        KernelRequestDTO requestDTO = new KernelRequestDTO(userId);

        return webClient.post()
                .uri(API_PATH)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//                .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                .header(HttpHeaders.AUTHORIZATION,"Bearer " + authorizationHeader)
                .bodyValue(requestDTO) // 요청 본문에 userId 포함
                .exchangeToMono(this::handleResponse);
    }
//    public Mono<KernelResponseDTO> createKernel(String jwtToken) {
//        log.info("🧠 커널 생성 요청");
//
//        return webClient.post()
//                .uri(API_PATH)
//                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//                .header(HttpHeaders.AUTHORIZATION, jwtToken)
//                .exchangeToMono(this::handleResponse);
//    }

    private Mono<KernelResponseDTO> handleResponse(ClientResponse response) {
        HttpStatusCode status = response.statusCode();
        log.info("📦 응답 상태 코드: {}", status);

        if (status.is2xxSuccessful()) {
            return response.bodyToMono(String.class)
                    .doOnNext(body -> log.info("📦 응답 바디 원문: {}", body))
                    .flatMap(this::parseKernelResponse);
        } else {
            return handleError(response);
        }
    }

    private Mono<KernelResponseDTO> parseKernelResponse(String jsonString) {
        try {
            KernelResponseDTO dto = objectMapper.readValue(jsonString, KernelResponseDTO.class);
            log.info("✅ 커널 응답 DTO 파싱 완료: {}", dto);
            return Mono.just(dto);
        } catch (Exception e) {
            String errorMsg = "❌ 커널 응답 파싱 실패";
            log.error("{}: {}", errorMsg, jsonString, e);
            return Mono.error(new KernelException(errorMsg, e));
        }
    }

    private Mono<KernelResponseDTO> handleError(ClientResponse clientResponse) {
        return clientResponse.bodyToMono(String.class)
                .flatMap(errorBody -> {
                    String errorMessage = String.format("🚨 커널 생성 실패 (%s): %s",
                            clientResponse.statusCode(), errorBody);
                    log.error(errorMessage);
                    return Mono.error(new KernelException(errorMessage));
                });
    }
}
