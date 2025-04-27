package io.goorm.backend.controller;

import io.goorm.backend.dto.project.ProjectMemberRequest;
import io.goorm.backend.dto.project.ProjectMemberResponse;
import io.goorm.backend.dto.project.ProjectRequest;
import io.goorm.backend.dto.project.ProjectResponse;
import io.goorm.backend.entity.Project;
import io.goorm.backend.global.response.ApiResponse;
import io.goorm.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "프로젝트 생성 및 삭제 API")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @Operation(
            summary = "프로젝트 생성",
            description = "RequestBody 에 name 필드로 새 프로젝트명을 전달합니다. 서비스에서 프로젝트와 루트 폴더를 함께 생성합니다."
    )
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectRequest request
    ) {
        // 프로젝트 + 루트 폴더 생성
        Project project = projectService.addProject(request.getName());
        if (project == null) {
            // 중복 이름 등으로 생성이 거부된 경우 400 리턴
            return ResponseEntity
                    .badRequest()
                    .body(null);
        }

        // 생성된 프로젝트를 DTO로 감싸서 반환
        return ResponseEntity
                .ok(new ProjectResponse(project));
    }

    @GetMapping
    @Operation(summary = "내 프로젝트 전체 조회", description = "소유·속해 있는 프로젝트를 모두 반환합니다.")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        List<ProjectResponse> dtos = projectService.getMyProjects();
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

    @PostMapping("/{projectId}/members")
    @Operation(
            summary = "프로젝트 멤버 추가",
            description = "새 멤버를 추가합니다."
    )
    public ResponseEntity<ApiResponse<Void>> addMember(
            @PathVariable Long projectId,
            @RequestBody ProjectMemberRequest request
    ) {
        projectService.addMember(projectId, request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(null, "프로젝트 멤버 추가 완료"));
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "특정 프로젝트 조회", description = "특정 프로젝트 정보를 반환합니다.")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long projectId) {
        ProjectResponse projectResponse = projectService.getProjectById(projectId);
        return ResponseEntity.ok(ApiResponse.success(projectResponse));
    }

    // 프로젝트 멤버 조회 (채팅방 멤버 조회 시 사용)
    @GetMapping("/{projectId}/members")
    @Operation(summary = "프로젝트 멤버 조회", description = "프로젝트의 멤버를 모두 조회합니다.")
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(@PathVariable Long projectId) {
        List<ProjectMemberResponse> members = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    // 프로젝트 인원 조회 (채팅방 인원 조회 시 사용)
    @GetMapping("/{projectId}/members/count")
    @Operation(summary = "프로젝트 멤버 인원 조회", description = "프로젝트의 멤버 인원을 조회합니다.")
    public ResponseEntity<ApiResponse<Integer>> getProjectMemberCount(@PathVariable Long projectId) {
        int count = projectService.getProjectMemberCount(projectId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}