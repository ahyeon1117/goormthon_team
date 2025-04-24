package io.goorm.backend.controller;

import io.goorm.backend.dto.Execute.ExecuteRequestDTO;
import io.goorm.backend.dto.Execute.ExecuteResponseDTO;
import io.goorm.backend.service.fastapi.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CodeExecutionController {
    private final CodeExecutionService codeExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<ExecuteResponseDTO> executeAndSave(@RequestParam Long fileId, @RequestBody ExecuteRequestDTO request) {
        // URL에서 받은 fileId와 함께 요청 처리
        ExecuteResponseDTO response = codeExecutionService.executeCodeAndSave(fileId, request);
        return ResponseEntity.ok(response);
    }
}
