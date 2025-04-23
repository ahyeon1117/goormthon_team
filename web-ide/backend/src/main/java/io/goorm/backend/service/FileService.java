package io.goorm.backend.service;

import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectRepository;
import io.goorm.backend.service.fastapi.FastApiFileClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final FastApiFileClient fastApiFileClient;  // FastAPI 알림 보내기

    @Transactional
    public File createFile(String fileName, String content, Long projectId, Long folderId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 프로젝트 조회 및 소유자 검증
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        // 폴더 여부 확인
        Folder folder = null;

        if (folderId != null) {
            // 폴더가 지정된 경우: 폴더 존재 여부 확인
            folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

            // 폴더 내부 중복 파일 이름 중복 검사
            Optional<File> existingFile = fileRepository.findByNameAndFolder(fileName, folder);
            if (existingFile.isPresent()) {
                throw new RuntimeException("해당 폴더에 같은 이름의 파일이 이미 존재합니다.");
            }
        } else {
            // 폴더가 없는 경우: 프로젝트 루트에서 중복 이름 검사
            Optional<File> existingFile = fileRepository.findByNameAndProjectAndFolderIsNull(fileName, project);
            if (existingFile.isPresent()) {
                throw new RuntimeException("프로젝트 루트에 같은 이름의 파일이 이미 존재합니다.");
            }
        }

        // 파일 생성 및 저장
        File file = File.builder()
                .name(fileName)
                .content(content)
                .project(project)
                .folder(folder) // null 가능
                .build();

//        File savedFile = fileRepository.save(file);  // 저장하면서 file_id 생성 💖
//        log.info("📄파일 저장 완료: savedFileId={}", savedFile.getId());
//
//        log.info("📄FastAPI에 파일 생성 알림 시작: fileId={}", savedFile.getId());
//        fastApiFileClient.notifyFileCreated(savedFile.getId());  // 👉 FastAPI에 알림
//
//        log.info("📄파일 생성 및 알림 완료: savedFileId={}", savedFile.getId());
//        return savedFile;
        File savedFile = fileRepository.save(file);  // 저장하면서 file_id 생성 💖
        log.info("📄파일 저장 완료: savedFileId={}", savedFile.getId());

        log.info("📄FastAPI에 파일 생성 알림 시작: fileId={}", savedFile.getId());

        try {
            fastApiFileClient.notifyFileCreated(savedFile.getId());  // 👉 FastAPI에 알림
            log.info("📄FastAPI에 파일 생성 알림 완료: fileId={}", savedFile.getId());
        } catch (Exception e) {
            log.error("❌ FastAPI에 파일 생성 알림 실패: fileId={}, error={}", savedFile.getId(), e.getMessage());
            throw new RuntimeException("FastAPI에 파일 생성 알림 실패");
        }

        return savedFile;

    }

    @Transactional
    public boolean deleteFile(Long fileId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        Project project = file.getProject();

        fileRepository.delete(file);
        return true;
    }

    @Transactional
    public File renameFile(Long fileId, String newName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 파일 조회
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        // 같은 폴더 내 중복 이름 검사
        Folder folder = file.getFolder();
        Optional<File> duplicate = fileRepository.findByNameAndFolder(newName, folder);
        if (duplicate.isPresent() && !duplicate.get().getId().equals(file.getId())) {
            throw new RuntimeException("같은 이름의 파일이 이미 존재합니다.");
        }

        // 이름 수정
        file.setName(newName);
        return file;
    }
}