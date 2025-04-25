package io.goorm.backend.dto.markdown;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AddMarkdownCellRequest {
    private String cell_type; // "markdown"
    private String source;    // 빈 문자열 가능
}
