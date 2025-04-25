package io.goorm.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FolderRequest {
    private Long folderId;
    private String folderName;
    private Long parentId;
    private Long projectId;
}
