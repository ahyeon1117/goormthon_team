package io.goorm.backend.repository;

import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.ProjectMember;
import io.goorm.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    boolean existsByProjectAndUser(Project project, User user);
    List<ProjectMember> findAllByUser(User user);

    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    // 채팅 조회 시 프로젝트 멤버 여부 검증
    boolean existsByProject_IdAndUser_Id(Long projectId, Long userId);
}
