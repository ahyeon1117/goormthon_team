package io.goorm.backend.service;

import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;



@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserService userService;
    private final JwtService jwtService;

    @Transactional
    public Project addProject(String projectName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 중복 프로젝트 이름 확인
        Optional<Project> existingProject = projectRepository.findByNameAndOwner(projectName, user);
        if (existingProject.isPresent()) {
            return null; // 이미 존재하는 경우 생성하지 않음
        }

        // 새 프로젝트 생성
        Project project = Project.builder()
                .name(projectName)
                .owner(user)
                .build();

        return projectRepository.save(project);
    }

    @Transactional
    public boolean deleteProject(Long projectId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        // 해당 프로젝트의 모든 폴더 조회
        List<Folder> folders = folderRepository.findAllByProject(project);

        // 각 폴더 안의 파일 삭제
        for (Folder folder : folders) {
            fileRepository.deleteAllByFolder(folder);
        }

        // 폴더 삭제
        folderRepository.deleteAll(folders);

        // 프로젝트 삭제
        projectRepository.delete(project);

        return true;
    }

    //현재 로그인한 사용자가 소유한 모든 프로젝트를 반환
    @Transactional
    public List<Project> getMyProjects() {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);
        return projectRepository.findAllByOwner(user);
    }

    //특정 프로젝트 폴더 반환
    @Transactional
    public List<Folder> getFoldersByProject(Long projectId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        return folderRepository.findAllByProject(project);
    }

    //특정 프로젝트 파일 반환
    @Transactional
    public List<File> getFilesByProject(Long projectId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        return fileRepository.findAllByProject(project);
    }

    @Transactional
    public Project renameProject(Long projectId, String newName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 프로젝트 조회
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        // 중복 이름 체크
        Optional<Project> duplicate = projectRepository.findByNameAndOwner(newName, user);
        if (duplicate.isPresent() && !duplicate.get().getId().equals(project.getId())) {
            throw new RuntimeException("같은 이름의 프로젝트가 이미 존재합니다.");
        }

        // 이름 변경
        project.setName(newName);
        return project;
    }

}