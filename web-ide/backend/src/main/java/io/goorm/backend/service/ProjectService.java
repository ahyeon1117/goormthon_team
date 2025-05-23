package io.goorm.backend.service;

import io.goorm.backend.dto.project.ProjectMemberResponse;
import io.goorm.backend.dto.project.ProjectResponse;
import io.goorm.backend.entity.*;
import io.goorm.backend.global.exception.DuplicateProjectMemberException;
import io.goorm.backend.global.exception.UnauthorizedException;
import io.goorm.backend.repository.ChatRoomRepository;
import io.goorm.backend.repository.FileRepository;
import io.goorm.backend.repository.FolderRepository;
import io.goorm.backend.repository.ProjectMemberRepository;
import io.goorm.backend.repository.ProjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final ProjectMemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final JwtService jwtService;

    //프로젝트 멤버 추가
    @Transactional
    public void addMember(Long projectId, String newUserEmail) {
        //요청자(토큰) → User 엔티티
        Long ownerId = jwtService.getUserId();
        User owner = userService.findById(ownerId);

        //프로젝트 조회 및 소유자 권한 확인
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
        if (!project.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedException("프로젝트 소유자만 멤버를 추가할 수 있습니다.");
        }

        //추가할 사용자 조회
        User newUser = userService.findByEmail(newUserEmail);
        log.info("[ProjectService] 추가할 사용자 조회 완료, 추가할 사용자 ID: {}", newUser.getEmail());

        //중복 여부 체크
        if (memberRepository.existsByProjectAndUser(project, newUser)) {
            log.info("[ProjectService] 이미 해당 프로젝트의 멤버입니다.");
            throw new DuplicateProjectMemberException("이미 해당 프로젝트의 멤버입니다.");
        }

        //멤버 엔티티 저장
        ProjectMember pm = ProjectMember.builder()
                .project(project)
                .user(newUser)
                .build();
        memberRepository.save(pm);

        log.info("[ProjectService] 프로젝트 멤버 추가 완료, 프로젝트 ID: {}, 추가할 사용자 ID: {}", project.getId(), newUser.getId());
    }

    //내가 소유하거나 멤버로 속한 모든 프로젝트 조회
    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects() {
        Long userId = jwtService.getUserId();
        User me     = userService.findById(userId);

        //내가 소유한 프로젝트
        List<Project> ownedProjects = projectRepository.findAllByOwner(me);

        //내가 참여한 프로젝트 (ProjectMember 통해 조회)
        List<Project> joinedProjects = memberRepository.findAllByUser(me).stream()
                .map(ProjectMember::getProject)
                .toList();

        //중복 제거 및 병합
        Set<Project> allProjects = new LinkedHashSet<>();
        allProjects.addAll(ownedProjects);
        allProjects.addAll(joinedProjects);

        //DTO 변환 후 반환
        return allProjects.stream()
                .map(ProjectResponse::new)
                .toList();
    }

    @Transactional
    public Project addProject(String projectName) {
        Long userId = jwtService.getUserId();
        User user = userService.findById(userId);

        // 중복 체크
        if (projectRepository.findByNameAndOwner(projectName, user).isPresent()) {
            return null;
        }

        // 1) 프로젝트 저장 (영속화)
        Project project = Project.builder()
                .name(projectName)
                .owner(user)
                .build();
        project = projectRepository.save(project);

        // 2) 루트 폴더 생성
        Folder rootFolder = Folder.builder()
                .name("main")       // 루트 폴더 이름
                .project(project)   // 방금 저장된 프로젝트 참조
                .parentId(null)     // 최상위 폴더이므로 parentId = null
                .build();
        folderRepository.save(rootFolder);

        // 3) 프로젝트 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .name(projectName + " 채팅방")
                .project(project)
                .build();
        chatRoomRepository.save(chatRoom);
        log.info("[ProjectService] 프로젝트 채팅방 생성 완료, 채팅방 ID: {}", chatRoom.getId());

        // 4) 자신을 프로젝트 멤버로 추가
        ProjectMember projectMember = ProjectMember.builder()
                .project(project)
                .user(user)
                .build();
        memberRepository.save(projectMember);
        log.info("[ProjectService] 자신을 프로젝트 멤버로 추가 완료, 프로젝트 ID: {}", project.getId());

        return project;
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

        // 채팅방 이름도 변경 (채팅방 이름: 프로젝트 이름 + " 채팅방")
        ChatRoom chatRoom = chatRoomRepository.findByProject(project)
                .orElseThrow(() -> new RuntimeException("프로젝트 채팅방이 존재하지 않습니다."));
        chatRoom.updateName(newName + " 채팅방");

        return project;
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));
        return new ProjectResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));

        List<ProjectMember> members = memberRepository.findAllByProject(project);
        return members.stream()
                .map(ProjectMemberResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public int getProjectMemberCount(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("해당 프로젝트가 존재하지 않습니다."));
                
        return memberRepository.findAllByProject(project).size();
    }
}
