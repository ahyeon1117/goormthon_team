package io.goorm.backend.controller;

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

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project", description = "프로젝트 생성 및 삭제 API")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "프로젝트 생성", description = "사용자의 새 프로젝트를 생성합니다.")
    public ResponseEntity<?> createProject(@RequestParam String name) {
        Project project = projectService.addProject(name);
        if (project == null) {
            return ResponseEntity.badRequest().body("중복된 프로젝트 이름입니다.");
        }

        //응답 DTO 생성
        ProjectResponse response = new ProjectResponse(project.getId(), project.getName(), project.getOwner().getId());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    @Operation(summary = "프로젝트 삭제", description = "해당 ID의 프로젝트와 관련된 모든 폴더 및 파일을 함께 삭제합니다.")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
        boolean result = projectService.deleteProject(projectId);
        if (result) {
            return ResponseEntity.ok("프로젝트가 삭제되었습니다.");
        } else {
            return ResponseEntity.status(404).body("삭제 실패: 프로젝트가 존재하지 않거나 권한이 없습니다.");
        }
    }

    //프로젝트 목록
    @GetMapping
    @Operation(summary = "내 프로젝트 목록 조회", description = "로그인 유저가 소유한 모든 프로젝트를 반환합니다.")
    public ResponseEntity<List<Project>> getMyProjects() {
        List<Project> projects = projectService.getMyProjects();
        return ResponseEntity.ok(projects);
    }

    //특정 프로젝트의 폴더 목록
    @GetMapping("/{projectId}/folders")
    @Operation(summary = "프로젝트 폴더 조회", description = "해당 프로젝트의 모든 폴더를 반환합니다.")
    public ResponseEntity<List<Folder>> getFoldersByProject(@PathVariable Long projectId) {
        List<Folder> folders = projectService.getFoldersByProject(projectId);
        return ResponseEntity.ok(folders);
    }

    //특정 프로젝트의 파일 목록
    @GetMapping("/{projectId}/files")
    @Operation(summary = "프로젝트 파일 조회", description = "해당 프로젝트의 모든 파일을 반환합니다.")
    public ResponseEntity<List<File>> getFilesByProject(@PathVariable Long projectId) {
        List<File> files = projectService.getFilesByProject(projectId);
        return ResponseEntity.ok(files);
    }

    @PatchMapping("/{projectId}")
    @Operation(summary = "프로젝트 이름 변경", description = "해당 ID의 프로젝트 이름을 새 이름으로 변경합니다.")
    public ResponseEntity<?> renameProject(@PathVariable Long projectId,
                                           @RequestParam String newName) {
        try {
            Project updatedProject = projectService.renameProject(projectId, newName);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}