package io.goorm.backend.dto.kernel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KernelResponseDTO {

    private String id;
    private String name;

    @JsonProperty("last_activity")
    private String lastActivity;

    @JsonProperty("execution_state")
    private String executionState;

    private Integer connections;
}