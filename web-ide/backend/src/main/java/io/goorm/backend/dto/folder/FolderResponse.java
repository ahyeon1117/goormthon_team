package io.goorm.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FolderResponse {
    private Long folderId;
    private String folderName;
    private Long projectId;
    private Long parentId; // 루트는 항상 null
}
