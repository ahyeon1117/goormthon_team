package io.goorm.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FolderRequest {
    private Long folderId;
    private Long projectId;
    private String folderName;
    private Long parentId;
}
