package io.goorm.backend.dto.Execute;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ExecuteResponseWithFileDTO extends ExecuteResponseDTO {

    @JsonProperty("file_id")
    private String fileId;
}
