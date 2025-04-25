package io.goorm.backend.service.fastapi;

import io.goorm.backend.dto.markdown.AddMarkdownCellRequest;
import io.goorm.backend.dto.markdown.AddMarkdownCellResponse;
import io.goorm.backend.dto.markdown.UpdateMarkdownCellRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@Slf4j
@Service
@RequiredArgsConstructor
public class MarkdownCellService {

    @Qualifier("myWebClient")
    private final WebClient webClient;

    public AddMarkdownCellResponse addMarkdownCell(Long fileId, AddMarkdownCellRequest requestDto) {
        return webClient.post()
                .uri("/api/files/{file_id}/add_markdown_cell", fileId)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestDto)
                .retrieve()
                .bodyToMono(AddMarkdownCellResponse.class)
                .block(); // 필요 시 async 처리 가능
    }

    // 마크다운 셀 수정 (수정된 내용을 FastAPI로 전송)
    public void updateMarkdownCell(Long fileId, UpdateMarkdownCellRequest request) {
        // FastAPI의 엔드포인트 URL
        String fastapiUrl = "api/files/{file_id}/update_markdown_cell";

        // WebClient를 이용해 PUT 요청을 보내는 부분
        webClient.put()
                .uri(fastapiUrl, fileId)  // cellId를 URL에 포함시킴
                .contentType(MediaType.APPLICATION_JSON)  // JSON 형식으로 요청
                .bodyValue(request)  // request DTO를 바디에 포함
                .retrieve()  // 응답 받기
                .toBodilessEntity()  // 응답 본문 없이 상태 코드만 받음
                .doOnError(e -> {
                    log.error("❌ FastAPI 요청 실패 - fileId: {}, 에러 메시지: {}", fileId, e.getMessage(), e);
                })
                .block();  // 동기 처리. 필요시 비동기로 변경 가능
    }

}
