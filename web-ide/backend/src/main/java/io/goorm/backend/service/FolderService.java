package io.goorm.backend.service;

import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final JwtService jwtService;

    /**
     * 새 프로젝트 생성 직후 호출해서
     * parent_id = null 인 루트 폴더("root")를 만들어 줍니다.
     */
    @Transactional
    public Folder createRootFolder(Long projectId) {
        // 1) 로그인 사용자 검증
        Long userId = jwtService.getUserId();
        User user   = userService.findById(userId);

        // 2) 프로젝트 존재 및 소유자 확인
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        // 3) 이미 루트 폴더가 있으면 그대로 반환
        Optional<Folder> existing = folderRepository.findByProjectAndParentIdIsNull(project);
        if (existing.isPresent()) {
            return existing.get();
        }

        // 4) 없으면 새로 생성
        Folder root = Folder.builder()
                .name("root")
                .project(project)
                .parentId(null)
                .build();
        return folderRepository.save(root);
    }

    /**
     * 사용자가 명시적으로 폴더를 생성할 때 호출합니다.
     */
    @Transactional
    public Folder createFolder(Long projectId, String folderName, Long parentId) {
        Long userId = jwtService.getUserId();
        User user   = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        Optional<Folder> duplicate =
                folderRepository.findByNameAndProject(folderName, project);
        if (duplicate.isPresent()) {
            throw new RuntimeException("같은 이름의 폴더가 이미 존재합니다.");
        }

        Folder folder = Folder.builder()
                .name(folderName)
                .project(project)
                .parentId(parentId)
                .build();
        return folderRepository.save(folder);
    }

    /**
     * 파일 생성 시 folderId가 null이면
     * 이 메서드를 통해 main(root) 폴더를 가져오거나 새로 만듭니다.
     */
    @Transactional(readOnly = true)
    public Folder getOrInitRootFolder(Long projectId) {
        // 루트 폴더가 없다면 createRootFolder가 생성해 줍니다.
        return createRootFolder(projectId);
    }

    /**
     * 특정 프로젝트 내, parentId 기준 하위 폴더 조회
     * parentId가 null이면 루트 폴더들만 리턴합니다.
     */
    @Transactional(readOnly = true)
    public List<Folder> getFolders(Long projectId, Long parentId) {
        Long userId = jwtService.getUserId();
        User user   = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        if (parentId == null) {
            return folderRepository.findAllByProjectAndParentIdIsNull(project);
        } else {
            return folderRepository.findAllByProjectAndParentId(project, parentId);
        }
    }

    @Transactional
    public boolean deleteFolder(Long folderId) {
        Long userId = jwtService.getUserId();
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

    @Transactional
    public Folder renameFolder(Long folderId, String newName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 폴더 조회
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));


        // 동일 프로젝트 내 중복 이름 확인
        Optional<Folder> duplicate = folderRepository.findByNameAndProject(newName, folder.getProject());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(folder.getId())) {
            throw new RuntimeException("같은 이름의 폴더가 이미 존재합니다.");
        }

        // 이름 변경 (setter 추가 필요)
        folder.setName(newName);
        return folder;
    }


}
