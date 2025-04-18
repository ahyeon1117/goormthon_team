package io.goorm.backend.controller;


import io.goorm.backend.entity.Project;
import io.goorm.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(project);
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
}
