package io.goorm.backend.service;

import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final JwtService jwtService;

    @Transactional
    public Folder createFolder(Long projectId, String folderName, Long parentId) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 프로젝트 존재 여부 및 소유자 확인
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        //중복 폴더 확인
        Optional<Folder> existingFolder = folderRepository.findByNameAndProject(folderName, project);
        if (existingFolder.isPresent()) {
            return null; // 중복되면 생성하지 않음
        }

        // 새 폴더 생성
        Folder folder = Folder.builder()
                .name(folderName)
                .project(project)
                .parentId(parentId)
                .build();

        return folderRepository.save(folder);
    }

    @Transactional
    public boolean deleteFolder(Long folderId) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 폴더 조회
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

        // 폴더 내 파일 모두 삭제
        fileRepository.deleteByFolder(folder);

        // 폴더 삭제
        folderRepository.delete(folder);

        //결과 반환
        return true;
    }
}
