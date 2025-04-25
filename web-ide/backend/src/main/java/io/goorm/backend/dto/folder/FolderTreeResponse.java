package io.goorm.backend.dto.folder;

import io.goorm.backend.entity.File;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class FolderTreeResponse {
    private Long folderId;
    private String folderName;
    private Long parentId;
    private List<File> files;
    private List<FolderTreeResponse> children;
}
