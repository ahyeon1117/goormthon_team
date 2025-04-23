package io.goorm.backend.controller;

import io.goorm.backend.dto.project.ProjectRequest;
import io.goorm.backend.dto.project.ProjectResponse;
import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "프로젝트 생성 및 삭제 API")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "프로젝트 생성", description = "사용자의 새 프로젝트를 생성합니다.")
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectRequest request
    ) {
        var project = projectService.addProject(request.getName());
        if (project == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(new ProjectResponse(project));
    }

    @GetMapping
    @Operation(summary = "내 프로젝트 목록 조회", description = "로그인 유저가 소유한 모든 프로젝트를 반환합니다.")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        var dtos = projectService.getMyProjects().stream()
                .map(ProjectResponse::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{projectId}")
    @Operation(summary = "프로젝트 이름 변경", description = "해당 ID의 프로젝트 이름을 새 이름으로 변경합니다.")
    public ResponseEntity<?> renameProject(
            @PathVariable Long projectId,
            @RequestBody ProjectRequest request
    ) {
        try {
            var updated = projectService.renameProject(projectId, request.getName());
            return ResponseEntity.ok(new ProjectResponse(updated));
        } catch (RuntimeException e) {
            // 중복 이름, 권한 없음, 프로젝트 미존재 등 모든 RuntimeException을 400으로 처리
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @DeleteMapping("/{projectId}")
    @Operation(summary = "프로젝트 삭제", description = "해당 프로젝트와 관련된 모든 폴더·파일을 삭제합니다.")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId
    ) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}/folders")
    @Operation(summary = "프로젝트 폴더 조회", description = "해당 프로젝트의 모든 폴더를 반환합니다.")
    public ResponseEntity<List<Folder>> getFoldersByProject(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(projectService.getFoldersByProject(projectId));
    }

    @GetMapping("/{projectId}/files")
    @Operation(summary = "프로젝트 파일 조회", description = "해당 프로젝트의 모든 파일을 반환합니다.")
    public ResponseEntity<List<File>> getFilesByProject(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(projectService.getFilesByProject(projectId));
    }
}