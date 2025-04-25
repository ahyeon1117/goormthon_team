package io.goorm.backend.controller;

import io.goorm.backend.dto.markdown.AddMarkdownCellRequest;
import io.goorm.backend.dto.markdown.AddMarkdownCellResponse;
import io.goorm.backend.dto.markdown.UpdateMarkdownCellRequest;
import io.goorm.backend.service.fastapi.MarkdownCellService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/markdown")
@RequiredArgsConstructor
public class MarkdownCellController {

    private final MarkdownCellService markdownCellService;

    @PostMapping("/add")
    public ResponseEntity<AddMarkdownCellResponse> addMarkdownCell(
            @RequestParam Long fileId,
            @RequestBody AddMarkdownCellRequest request) {

        log.info("📝 마크다운 셀 추가 요청 수신 - fileId: {}", fileId);
        log.debug("📄 요청 바디 - cellType: {}, source: {}", request.getCell_type(), request.getSource());

        try {
            AddMarkdownCellResponse response = markdownCellService.addMarkdownCell(fileId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ 마크다운 셀 추가 실패 - fileId: {}, 에러 메시지: {}", fileId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // 마크다운 셀 수정
    @PutMapping("/update")
    public ResponseEntity<Void> updateMarkdownCell(
            @RequestParam Long fileId,  // 파일 ID (쿼리 파라미터로 받음)
            @RequestBody UpdateMarkdownCellRequest request) {  // 수정할 내용이 담긴 요청

        String cellId = request.getCell_id();  // 요청 본문에서 cell_id 받기

        log.info("📝 마크다운 셀 수정 요청 수신 - cellId: {}, fileId: {}", cellId, fileId);
        log.debug("📄 요청 바디 - markdown: {}", request.getSource());

        try {
            // 서비스에서 마크다운 셀 수정
            markdownCellService.updateMarkdownCell(fileId, request);
            return ResponseEntity.ok().build();  // 수정 성공 시 200 OK 응답
        } catch (Exception e) {
            log.error("❌ 마크다운 셀 수정 실패 - cellId: {}, fileId: {}, 에러 메시지: {}", cellId, fileId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
