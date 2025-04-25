package io.goorm.backend.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FileRenameRequest {
    private Long fileId;
    private String newName;
}
