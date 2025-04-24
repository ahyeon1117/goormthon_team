package io.goorm.backend.repository;

import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.ProjectMember;
import io.goorm.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    boolean existsByProjectAndUser(Project project, User user);
    List<ProjectMember> findAllByUser(User user);
}
