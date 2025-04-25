package io.goorm.backend.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FileDetailResponse {
    private Long fileId;
    private String fileName;
    private Long folderId;
    private Long projectId;
    private String notebookJson; // notebookJson 필드 추가
}
