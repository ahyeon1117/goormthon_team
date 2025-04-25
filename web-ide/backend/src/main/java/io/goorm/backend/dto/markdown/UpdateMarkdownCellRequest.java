package io.goorm.backend.dto.markdown;
import java.util.List;

import lombok.Data;

@Data
public class UpdateMarkdownCellRequest {
    private String cell_id;
    private List<String> source;
}
