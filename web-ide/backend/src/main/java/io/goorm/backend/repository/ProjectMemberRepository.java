package io.goorm.backend.repository;

import io.goorm.backend.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
}
