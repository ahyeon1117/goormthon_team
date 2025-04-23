package io.goorm.backend.controller;

import io.goorm.backend.entity.File;
import io.goorm.backend.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "File", description = "파일 생성·삭제·이름변경 API")

public class FileController {
    private final FileService fileService;

    @PostMapping
    @Operation(summary = "파일 생성", description = "프로젝트 또는 폴더 내에 새 파일을 생성합니다.")
    public ResponseEntity<?> createFile(
            @RequestParam String fileName,
            @RequestParam String content,
            @RequestParam Long projectId,
            @RequestParam(required = false) Long folderId
    ) {
        try {
            File file = fileService.createFile(fileName, content, projectId, folderId);
            return ResponseEntity.ok(file); // file.getId() 포함된 객체 반환 💖
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{fileId}")
    @Operation(summary = "파일 삭제", description = "해당 파일을 삭제합니다.")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) {
        try {
            fileService.deleteFile(fileId);
            return ResponseEntity.ok("파일이 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(404)
                    .body(e.getMessage());
        }
    }

    @PatchMapping("/{fileId}")
    @Operation(summary = "파일 이름 변경", description = "해당 파일의 이름을 새 이름으로 변경합니다.")
    public ResponseEntity<?> renameFile(
            @PathVariable Long fileId,
            @RequestParam String newName
    ) {
        try {
            File updated = fileService.renameFile(fileId, newName);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
