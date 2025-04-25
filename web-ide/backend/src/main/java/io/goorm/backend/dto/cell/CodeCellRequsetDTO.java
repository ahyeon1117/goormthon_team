package io.goorm.backend.dto.cell;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CodeCellRequsetDTO {

    @JsonProperty("cell_type")
    private String cellType;

    @JsonProperty("source")
    private String source;
}
