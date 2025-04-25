package io.goorm.backend.controller;

import io.goorm.backend.dto.cell.CodeCellRequsetDTO;
import io.goorm.backend.dto.cell.CodeCellResponseDTO;
import io.goorm.backend.service.fastapi.CodeCellService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/codecell")
@RequiredArgsConstructor
public class CodeCellController {

    private final CodeCellService codecellService;

    @PostMapping("/add")
    public ResponseEntity<CodeCellResponseDTO> addCodeCell(
            @RequestParam Long fileId,
            @RequestBody CodeCellRequsetDTO request) {
        log.info("📥 코드 셀 추가 요청 수신 - fileId: {}", fileId);
        log.debug("📄 요청 바디 - cellType: {}, source: {}", request.getCellType(), request.getSource());

        try {
            CodeCellResponseDTO response = codecellService.addCodeCell(fileId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ 코드 셀 추가 실패 - fileId: {}, 에러 메시지: {}", fileId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
