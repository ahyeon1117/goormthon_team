package io.goorm.backend.repository;

import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long>
{
    Optional<Project> findByNameAndOwner(String projectName, User user);

    List<Project> findAllByOwner(User user);
}