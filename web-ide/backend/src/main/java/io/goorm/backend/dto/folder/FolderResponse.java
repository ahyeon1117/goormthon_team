package io.goorm.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FolderResponse {
    private final Long   folderId;
    private final String folderName;
    private final Long   projectId;
    private final Long   parentId;
}
