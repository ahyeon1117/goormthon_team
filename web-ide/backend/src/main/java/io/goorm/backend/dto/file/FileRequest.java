package io.goorm.backend.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FileRequest {
    private String fileName;
    private Long projectId;
    private Long folderId;
}
