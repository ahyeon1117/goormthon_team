package io.goorm.backend.service;

import io.goorm.backend.dto.file.FileDetailResponse;
import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectMemberRepository;
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
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final FastApiFileClient fastApiFileClient;

    @Transactional
    public File createFile(String fileName, Long projectId, Long folderId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        //프로젝트 존재 여부 확인
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        //프로젝트 소유자 또는 멤버 여부 확인
        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);
        if (!isOwner && !isMember) {
            throw new RuntimeException("해당 프로젝트에 대한 권한이 없습니다.");
        }

        //폴더 지정 여부 확인 및 검증
        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

            // 폴더가 해당 프로젝트에 속해 있는지 확인
            if (!folder.getProject().getId().equals(projectId)) {
                throw new RuntimeException("해당 폴더는 지정한 프로젝트에 속하지 않습니다.");
            }

            // 폴더 내 중복 파일 이름 검사
            Optional<File> existingFile = fileRepository.findByNameAndFolder(fileName, folder);
            if (existingFile.isPresent()) {
                throw new RuntimeException("해당 폴더에 같은 이름의 파일이 이미 존재합니다.");
            }
        } else {
            // 프로젝트 루트 디렉토리 내에서 중복 검사
            Optional<File> existingFile = fileRepository.findByNameAndProjectAndFolderIsNull(fileName, project);
            if (existingFile.isPresent()) {
                throw new RuntimeException("프로젝트 루트에 같은 이름의 파일이 이미 존재합니다.");
            }
        }

        //파일 생성 및 저장
        File file = File.builder()
                .name(fileName)
                .project(project)
                .folder(folder)
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

    public FileDetailResponse getFileDetail(Long fileId) {
        // 파일 조회 (트랜잭션이 필요)
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        // FastAPI에서 notebook JSON을 가져옴 (트랜잭션 관리 필요 없음)
        String notebookJson = fastApiFileClient.getNotebookJson(fileId);

        // FileDetailResponse로 응답 생성
        return new FileDetailResponse(
                file.getId(),
                file.getName(),
                file.getFolder() != null ? file.getFolder().getId() : null,
                file.getProject().getId(),
                notebookJson // notebookJson 포함
        );
    }



    @Transactional
    public boolean deleteFile(Long fileId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        //파일 조회 및 존재 여부 확인
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        //파일이 속한 프로젝트 조회
        Project project = file.getProject();

        //프로젝트 소유자 또는 멤버 여부 확인
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);
        if (!isOwner && !isMember) {
            throw new RuntimeException("해당 파일을 삭제할 권한이 없습니다.");
        }

        //삭제
        fileRepository.delete(file);
        return true;
    }

    @Transactional
    public File renameFile(Long fileId, String newName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        //파일 조회
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        //소유자 또는 멤버 검증
        Project project = file.getProject();
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);
        if (!isOwner && !isMember) {
            throw new RuntimeException("파일 이름을 변경할 권한이 없습니다.");
        }

        //같은 폴더 내 중복 이름 검사
        Folder folder = file.getFolder();
        Optional<File> duplicate = fileRepository.findByNameAndFolder(newName, folder);
        if (duplicate.isPresent() && !duplicate.get().getId().equals(file.getId())) {
            throw new RuntimeException("같은 이름의 파일이 이미 존재합니다.");
        }

        //이름 변경
        file.setName(newName);
        return file;
    }


}