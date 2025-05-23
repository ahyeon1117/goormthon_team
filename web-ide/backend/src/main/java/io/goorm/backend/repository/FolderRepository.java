package io.goorm.backend.repository;

import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import io.goorm.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    Optional<Folder> findByNameAndProject(String folderName, Project project);
    Optional<Folder> findByProjectAndParentIdIsNull(Project project);
    Optional<Folder> findByNameAndProjectAndParentId(String name, Project project, Long parentId);

    List<Folder> findAllByProject(Project project);
    List<Folder> findAllByProjectAndParentIdIsNull(Project project);
    List<Folder> findAllByProjectAndParentId(Project project, Long parentId);
    List<Folder> findAllByProjectAndName(Project project, String folderName);
}