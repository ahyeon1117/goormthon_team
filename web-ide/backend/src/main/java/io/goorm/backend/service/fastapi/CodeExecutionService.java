package io.goorm.backend.service.fastapi;

import io.goorm.backend.dto.Execute.ExecuteRequestDTO;
import io.goorm.backend.dto.Execute.ExecuteResponseDTO;
import io.goorm.backend.dto.Execute.ExecuteResponseWithFileDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeExecutionService {

    @Qualifier("myWebClient")
    private final WebClient webClient;



    public ExecuteResponseDTO executeCodeAndSave(Long fileId, ExecuteRequestDTO request) {
        try {
            // fileId를 포함하여 FastAPI에 요청
            ExecuteResponseDTO response = webClient.post()
                    .uri("/api/execute/{fileId}", fileId)  // fileId를 URL에 포함
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ExecuteResponseDTO.class)
                    .block(); // 동기 방식

            if (response != null) {
                log.info("✅ 코드 실행 성공! response: {}", response);
                // file_id를 추가하여 저장
                saveExecutionResult(fileId, response);
            } else {
                log.warn("⚠️ FastAPI로부터 null 응답을 받았습니다.");
            }
            return response;
        } catch (Exception e) {
            log.error("❌ 코드 실행 중 오류 발생: {}", e.getMessage(), e);
            return null;  // 예외 발생 시 null 반환
        }
    }

    private void saveExecutionResult(Long fileId, ExecuteResponseDTO res) {
        try {
            // file_id를 추가하여 ExecuteResponseWithFileDTO로 변환
            ExecuteResponseWithFileDTO responseWithFile = new ExecuteResponseWithFileDTO();
            responseWithFile.setFileId(fileId.toString());  // file_id 설정
            responseWithFile.setCellId(res.getCellId());
            responseWithFile.setCode(res.getCode());
            responseWithFile.setStdout(res.getStdout());
            responseWithFile.setStderr(res.getStderr());
            responseWithFile.setResult(res.getResult());

            // 요청 데이터 로그 출력
            log.info("Sending execution result to save: {}", responseWithFile);

            // 결과 저장
            webClient.post()
                    .uri("/api/save_execution")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(responseWithFile)  // 요청 본문
                    .retrieve()  // 응답을 받기 위한 메서드
                    .bodyToMono(Void.class)  // 응답 본문 처리
                    .doOnSuccess(aVoid -> log.info("Execution result saved successfully"))
                    .doOnError(e -> log.error("Error during saving execution result: {}", e.getMessage()))
                    .doFinally(signalType -> log.info("Execution result save completed")) // 요청 종료 후 로그
                    .block(); // 동기 방식

        } catch (Exception e) {
            log.error("❌ 결과 저장 중 오류 발생: {}", e.getMessage(), e);
        }
    }
}
