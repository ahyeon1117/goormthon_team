package io.goorm.backend.repository;

import io.goorm.backend.entity.File;
import io.goorm.backend.entity.Folder;
import io.goorm.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByNameAndFolder(String fileName, Folder folder);

    void deleteByFolder(Folder folder);

    void deleteAllByFolder(Object folder);
}
