package io.goorm.backend.service.fastapi;

import io.goorm.backend.dto.cell.CodeCellRequsetDTO;
import io.goorm.backend.dto.cell.CodeCellResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Slf4j
@Service
@RequiredArgsConstructor

public class CodeCellService {
    @Qualifier("myWebClient")
    private final WebClient webClient;

    public CodeCellResponseDTO addCodeCell(Long fileId, CodeCellRequsetDTO request) {
        log.info("📝 코드 셀 추가 요청을 보냅니다. 요청 데이터: {}");
        log.debug("📨 전송할 셀 데이터 - cellType: {}, source: {}", request.getCellType(), request.getSource());

        try {
            CodeCellResponseDTO response = webClient.post()
                    .uri("/api/files/{fileId}/add_code_cell", fileId)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CodeCellResponseDTO.class)
                    .block(); // 동기 처리

            log.info("✅ 코드 셀 추가 성공 - 반환된 cellId: {}", response.getCellId());
            return response;

        } catch (Exception e) {
            log.error("❌ 코드 셀 추가 실패 - fileId: {}, 에러: {}", fileId, e.getMessage(), e);
            throw new RuntimeException("FastAPI 연동 실패: " + e.getMessage(), e);
        }
    }
}