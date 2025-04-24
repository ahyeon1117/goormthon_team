// io.goorm.backend.dto.ExecuteResponse.java
package io.goorm.backend.dto.Execute;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExecuteResponseDTO {

    @JsonProperty("cell_id")
    private String cellId;

    private String code;
    private String stdout;
    private String stderr;
    private String result;
}
