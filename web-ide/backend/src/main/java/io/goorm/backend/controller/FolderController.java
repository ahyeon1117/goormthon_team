package io.goorm.backend.controller;

import io.goorm.backend.dto.folder.FolderRenameRequest;
import io.goorm.backend.dto.folder.FolderRequest;
import io.goorm.backend.dto.folder.FolderResponse;
import io.goorm.backend.dto.folder.FolderTreeResponse;
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

    //main폴더 조회 및 생성
    @GetMapping("/{projectId}/root")
    @Operation(
            summary = "루트 폴더 조회",
            description = "루트 폴더를 반환합니다. 없으면 자동으로 생성됩니다. "
    )
    public ResponseEntity<FolderResponse> getOrCreateRootFolder(@PathVariable Long projectId) {
        Folder root = folderService.createRootFolder(projectId);

        FolderResponse response = new FolderResponse(
                root.getId(),
                root.getName(),                // 항상 "main"
                root.getProject().getId(),
                null                           // 루트 폴더는 parentId가 null
        );
        return ResponseEntity.ok(response);
    }

    //하위 폴더 생성
    @PostMapping
    @Operation(summary = "폴더 생성", description = "parentId가 없으면 루트 폴더 아래, 있으면 그 폴더 아래에 생성됩니다.")
    public ResponseEntity<FolderResponse> createFolder(@RequestBody FolderRequest request) {
        Folder folder = folderService.createFolder(
                request.getProjectId(),
                request.getFolderName(),
                request.getParentId()  // null 가능
        );

        FolderResponse response = new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getProject().getId(),
                folder.getParentId()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{folderId}")
    @Operation(summary = "특정 폴더 조회", description = "folderId로 특정 폴더를 조회합니다.")
    public ResponseEntity<FolderResponse> getFolderById(
            @RequestParam Long projectId,
            @PathVariable Long folderId
    ) {
        Folder folder = folderService.getFolderById(projectId, folderId);
        return ResponseEntity.ok(new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getProject().getId(),
                folder.getParentId()
        ));
    }

    @GetMapping("/tree/{projectId}")
    @Operation(summary = "폴더 트리 조회", description = "루트 또는 지정한 폴더의 하위 구조를 조회합니다.")
    public ResponseEntity<FolderTreeResponse> getProjectFolderTree(
            @PathVariable Long projectId,
            @RequestParam(required = false) Long folderId
    ) {
        FolderTreeResponse tree = folderService.getFolderTree(projectId, folderId);
        return ResponseEntity.ok(tree);
    }


    @DeleteMapping
    @Operation(summary = "폴더 삭제", description = "해당 폴더 및 하위 폴더/파일 삭제")
    public ResponseEntity<Void> deleteFolder(@RequestBody FolderRequest request) {
        folderService.deleteFolder(request.getProjectId(), request.getFolderId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping
    @Operation(summary = "폴더 이름 변경", description = "폴더의 이름을 변경합니다.")
    public ResponseEntity<FolderResponse> renameFolder(
            @RequestBody FolderRenameRequest request
    ) {
        Folder folder = folderService.renameFolder(
                request.getProjectId(),
                request.getFolderId(),
                request.getNewName()  // 또는 getNewName() → 일치하도록 DTO 조정 필요
        );

        return ResponseEntity.ok(new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getProject().getId(),
                folder.getParentId()
        ));
    }

}
