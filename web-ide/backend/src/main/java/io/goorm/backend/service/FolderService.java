package io.goorm.backend.service;

import io.goorm.backend.dto.folder.FolderTreeResponse;
import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectMemberRepository;
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
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;
    private final JwtService jwtService;

   //root폴더 확인 및 생성
    @Transactional
    public Folder createRootFolder(Long projectId) {
        // 로그인 사용자, 프로젝트 검증
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("본인의 프로젝트가 아닙니다.");
        }

        // 이미 루트 폴더가 있으면 반환하되, 이름이 다르면 수정
        Optional<Folder> existing = folderRepository.findByProjectAndParentIdIsNull(project);
        if (existing.isPresent()) {
            Folder root = existing.get();
            if (!"main".equals(root.getName())) {
                root.setName("main"); // 이름을 "main"으로 수정
                return folderRepository.save(root); // 수정된 폴더 저장 후 반환
            }
            return root;
        }

        //없으면 새로 생성
        Folder root = Folder.builder()
                .name("main")
                .project(project)
                .parentId(null)
                .build();

        return folderRepository.save(root);
    }

    //폴더 생성
    @Transactional
    public Folder createFolder(Long projectId, String folderName, Long parentId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        // 소유자 또는 멤버인지 검증
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = projectMemberRepository.existsByUserIdAndProjectId(userId, projectId);
        if (!isOwner && !isMember) {
            throw new RuntimeException("프로젝트 접근 권한이 없습니다.");
        }

        // parentId가 없으면 루트 폴더를 보장하고 해당 ID로 설정
        if (parentId == null) {
            Folder root = createRootFolder(projectId);
            parentId = root.getId();
        }

        // 부모 폴더 존재 여부 및 같은 프로젝트인지 확인
        Folder parent = folderRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("부모 폴더가 존재하지 않습니다."));
        if (!parent.getProject().getId().equals(projectId)) {
            throw new RuntimeException("부모 폴더가 해당 프로젝트에 속하지 않습니다.");
        }

        // 중복 이름 확인
        Optional<Folder> duplicate = folderRepository
                .findByNameAndProjectAndParentId(folderName, project, parentId);
        if (duplicate.isPresent()) {
            throw new RuntimeException("같은 이름의 폴더가 이미 존재합니다.");
        }

        // 생성
        Folder folder = Folder.builder()
                .name(folderName)
                .project(project)
                .parentId(parentId)
                .build();
        return folderRepository.save(folder);
    }

    //폴더 조회
    @Transactional(readOnly = true)
    public Folder getFolderById(Long projectId, Long folderId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

        if (!folder.getProject().getId().equals(projectId)) {
            throw new RuntimeException("해당 폴더는 요청한 프로젝트에 속하지 않습니다.");
        }

        return folder;
    }

    //폴더 + 파일 조회
    @Transactional(readOnly = true)
    public FolderTreeResponse getRootFolderTree(Long projectId) {
        // 루트 폴더 조회 (없으면 예외)
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        Folder root = folderRepository.findByProjectAndParentIdIsNull(project)
                .orElseThrow(() -> new RuntimeException("루트 폴더가 존재하지 않습니다."));

        return buildTree(root);
    }

    private FolderTreeResponse buildTree(Folder folder) {
        List<File> files = fileRepository.findAllByFolder(folder);
        List<Folder> children = folderRepository.findAllByProjectAndParentId(folder.getProject(), folder.getId());

        List<FolderTreeResponse> childTrees = children.stream()
                .map(this::buildTree)
                .toList();

        return new FolderTreeResponse(
                folder.getId(),
                folder.getName(),
                folder.getParentId(),
                files,
                childTrees
        );
    }


    @Transactional
    public boolean deleteFolder(Long projectId, Long folderId) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

        // 폴더가 요청한 프로젝트에 속하는지 확인
        if (!folder.getProject().getId().equals(projectId)) {
            throw new RuntimeException("해당 폴더는 요청한 프로젝트에 속하지 않습니다.");
        }

        Project project = folder.getProject();
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);

        if (!isOwner && !isMember) {
            throw new RuntimeException("폴더를 삭제할 권한이 없습니다.");
        }

        // 하위 폴더와 파일 전부 삭제
        deleteRecursively(folder);

        return true;
    }


    //내부 재귀 메서드: 현재 폴더와 하위 구조 전부 삭제
    private void deleteRecursively(Folder folder) {
        //하위 폴더 먼저 조회
        List<Folder> subFolders = folderRepository
                .findAllByProjectAndParentId(folder.getProject(), folder.getId());

        //하위 폴더들 재귀 삭제
        for (Folder subFolder : subFolders) {
            deleteRecursively(subFolder);
        }

        //현재 폴더의 파일들 삭제
        fileRepository.deleteByFolder(folder);

        //현재 폴더 삭제
        folderRepository.delete(folder);
    }

    @Transactional
    public Folder renameFolder(Long projectId, Long folderId, String newName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더가 존재하지 않습니다."));

        // 폴더가 요청한 프로젝트에 속하는지 확인
        if (!folder.getProject().getId().equals(projectId)) {
            throw new RuntimeException("해당 폴더는 요청한 프로젝트에 속하지 않습니다.");
        }

        Project project = folder.getProject();
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);

        if (!isOwner && !isMember) {
            throw new RuntimeException("폴더 이름을 변경할 권한이 없습니다.");
        }

        // 중복 이름 검사 (같은 부모 안에서)
        Optional<Folder> duplicate = folderRepository.findByNameAndProjectAndParentId(
                newName, project, folder.getParentId());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(folderId)) {
            throw new RuntimeException("같은 이름의 폴더가 이미 존재합니다.");
        }

        folder.setName(newName);
        return folder;
    }

}
