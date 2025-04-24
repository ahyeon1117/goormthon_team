package io.goorm.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FolderRenameRequest {
    private Long folderId;
    private Long projectId;
    private String newName;
}
