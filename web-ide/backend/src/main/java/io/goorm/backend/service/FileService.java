package io.goorm.backend.service;

import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final JwtService jwtService;

    @Transactional
    public File createFile(String fileName, String content, Long projectId, Long folderId) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

        Optional<File> existingFile = fileRepository.findByNameAndFolder(fileName, folder);
        if (existingFile.isPresent()) {
            return null; // 중복된 이름의 파일이 있으면 생성 안 함
        }

        File file = File.builder()
                .name(fileName)
                .content(content)
                .folder(folder)
                .project(project)
                .build();

        return fileRepository.save(file);
    }

    @Transactional
    public boolean deleteFile(Long fileId) {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        Project project = file.getProject();

        fileRepository.delete(file);
        return true;
    }


}
