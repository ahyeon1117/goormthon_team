package io.goorm.backend.controller;

import io.goorm.backend.dto.folder.FolderRenameRequest;
import io.goorm.backend.dto.folder.FolderRequest;
import io.goorm.backend.dto.folder.FolderResponse;
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

    /**
     * 프로젝트당 하나만 존재하는 메인(root) 폴더를 생성하거나,
     * 이미 있으면 조회합니다.
     */
    @PostMapping("/root")
    @Operation(summary = "루트 폴더 생성/조회",
            description = "프로젝트 생성 시 자동으로 만들어지는 메인(root) 폴더를 보장합니다.")
    public ResponseEntity<FolderResponse> createOrGetRoot(
            @PathVariable Long projectId
    ) {
        Folder root = folderService.createRootFolder(projectId);
        FolderResponse resp = new FolderResponse(
                root.getId(),
                root.getName(),
                root.getProject().getId(),
                root.getParentId()
        );
        return ResponseEntity.ok(resp);
    }

    /**
     * 메인(root) 폴더 바로 아래에만 새 하위 폴더를 생성합니다.
     * (parentId 파라미터 없이 호출하세요)
     */
    @PostMapping
    @Operation(summary = "새 하위 폴더 생성",
            description = "메인(root) 폴더 아래에 새 폴더를 생성합니다.")
    public ResponseEntity<FolderResponse> createFolder(
            @PathVariable Long projectId,
            @RequestBody FolderRequest request
    ) {
        Folder folder = folderService.createFolder(
                projectId,
                request.getFolderName()
        );
        FolderResponse resp = new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getProject().getId(),
                folder.getParentId()
        );
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{folderId}")
    @Operation(summary = "폴더 삭제", description = "해당 폴더와 그 안의 모든 파일을 삭제합니다.")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable Long folderId
    ) {
        folderService.deleteFolder(folderId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{folderId}")
    @Operation(summary = "폴더 이름 변경", description = "해당 폴더의 이름을 새 이름을 변경합니다.")
    public ResponseEntity<FolderResponse> renameFolder(
            @PathVariable Long folderId,
            @RequestBody FolderRenameRequest request
    ) {
        Folder updated = folderService.renameFolder(folderId, request.getNewName());

        FolderResponse response = new FolderResponse(
                updated.getId(),
                updated.getName(),
                updated.getProject().getId(),
                updated.getParentId()
        );
        return ResponseEntity.ok(response);
    }
}
