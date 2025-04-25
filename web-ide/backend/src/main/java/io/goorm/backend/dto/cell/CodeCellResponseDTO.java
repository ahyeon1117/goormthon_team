package io.goorm.backend.dto.cell;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeCellResponseDTO {
    @JsonProperty("cell_id")
    private String cellId;

}
