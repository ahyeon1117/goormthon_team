package io.goorm.backend.dto.kernel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class KernelRequestDTO {
    @JsonProperty("kernel_id")
    private Long user_id; // FastAPI와 일치하는 snake_case
}
