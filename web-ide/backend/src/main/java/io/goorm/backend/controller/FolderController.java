package io.goorm.backend.controller;

import io.goorm.backend.entity.Folder;
import io.goorm.backend.service.FolderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
@Tag(name = "Folder", description = "폴더 생성·삭제·이름변경 API")
public class FolderController {
    private final FolderService folderService;

    @PostMapping
    @Operation(summary = "폴더 생성", description = "프로젝트 내에 새 폴더를 생성합니다.")
    public ResponseEntity<?> createFolder(
            @RequestParam Long projectId,
            @RequestParam String folderName,
            @RequestParam(required = false) Long parentId
    ) {
        Folder folder = folderService.createFolder(projectId, folderName, parentId);
        if (folder == null) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 동일한 이름의 폴더가 존재합니다.");
        }
        return ResponseEntity.ok(folder);
    }

    @DeleteMapping("/{folderId}")
    @Operation(summary = "폴더 삭제", description = "해당 폴더와 그 안의 모든 파일을 삭제합니다.")
    public ResponseEntity<?> deleteFolder(@PathVariable Long folderId) {
        boolean deleted = folderService.deleteFolder(folderId);
        if (deleted) {
            return ResponseEntity.ok("폴더가 삭제되었습니다.");
        } else {
            return ResponseEntity
                    .status(404)
                    .body("삭제할 폴더가 없거나 권한이 없습니다.");
        }
    }

    @PatchMapping("/{folderId}")
    @Operation(summary = "폴더 이름 변경", description = "해당 폴더의 이름을 새 이름으로 변경합니다.")
    public ResponseEntity<?> renameFolder(
            @PathVariable Long folderId,
            @RequestParam String newName
    ) {
        try {
            Folder updated = folderService.renameFolder(folderId, newName);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
