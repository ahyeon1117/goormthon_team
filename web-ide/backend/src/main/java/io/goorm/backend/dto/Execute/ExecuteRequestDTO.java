// io.goorm.backend.dto.ExecuteRequest.java
package io.goorm.backend.dto.Execute;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExecuteRequestDTO {
    @JsonProperty("cell_id")
    private String cellId;

    private String code;

    @JsonProperty("kernel_id")
    private String kernelId;

}
