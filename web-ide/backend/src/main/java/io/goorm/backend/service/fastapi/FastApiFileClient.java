package io.goorm.backend.service.fastapi;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@Slf4j
public class FastApiFileClient {

    @Qualifier("myWebClient")
    private final WebClient webClient;

    public void notifyFileCreated(Long fileId) {
        webClient.post()
                .uri("/api/files/{file_id}", fileId)
                .retrieve()
                .bodyToMono(Void.class)
                .doOnSuccess(unused -> log.info("✅ FastAPI에 파일 생성 알림 성공: {}", fileId))
                .doOnError(error -> log.error("❌ FastAPI 파일 생성 실패: {}", fileId, error))
                .doFinally(signalType -> log.info("📄FastAPI 알림 요청 완료: fileId={}", fileId))
                .subscribe(); // ← 비동기 호출 (Spring 흐름에 영향 없음)

    }
}
