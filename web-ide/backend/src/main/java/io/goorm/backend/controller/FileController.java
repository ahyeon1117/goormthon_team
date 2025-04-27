package io.goorm.backend.controller;

import io.goorm.backend.dto.file.FileDetailResponse;
import io.goorm.backend.dto.file.FileRenameRequest;
import io.goorm.backend.dto.file.FileRequest;
import io.goorm.backend.dto.file.FileResponse;
import io.goorm.backend.entity.File;
import io.goorm.backend.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "File", description = "파일 생성·삭제·이름변경 API")

public class FileController {
    private final FileService fileService;

    @PostMapping
    @Operation(summary = "파일 생성", description = "프로젝트 또는 폴더 내에 새 파일을 생성합니다.")
    public ResponseEntity<FileResponse> createFile(
            @RequestBody FileRequest request
    ) {
        try {
            File file = fileService.createFile(
                    request.getFileName(),
                    request.getProjectId(),
                    request.getFolderId()
            );

            FileResponse response = new FileResponse(
                    file.getId(),
                    file.getName(),
                    file.getFolder() != null ? file.getFolder().getId() : null,
                    file.getProject().getId()


            );

            return ResponseEntity.ok(response); // file.getId() 포함된 객체 반환 💖
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest().build();
        }
    }

    @GetMapping("/{fileId}")
    @Operation(summary = "파일 조회", description = "몽고DB json ipynb 양식 출력.")
    public ResponseEntity<FileDetailResponse> getFile(@PathVariable Long fileId) {
        try {
            FileDetailResponse response = fileService.getFileDetail(fileId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("파일 조회 실패 또는 알 수 없는 오류", e);
            // Swagger에선 body가 String이지만, 여기선 500 응답만 명시되어도 됨
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("/{fileId}")
    @Operation(summary = "파일 삭제", description = "해당 파일을 삭제합니다.")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) {
        try {
            boolean deleted = fileService.deleteFile(fileId);
            if (deleted) {
                return ResponseEntity.ok("파일이 삭제되었습니다.");
            } else {
                return ResponseEntity.status(400).body("파일 삭제에 실패했습니다.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }


    @PatchMapping("/rename")
    @Operation(summary = "파일 이름 변경", description = "해당 파일의 이름을 변경합니다.")
    public ResponseEntity<?> renameFile(@RequestBody FileRenameRequest request) {
        try {
            File updated = fileService.renameFile(request.getFileId(), request.getNewName());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
