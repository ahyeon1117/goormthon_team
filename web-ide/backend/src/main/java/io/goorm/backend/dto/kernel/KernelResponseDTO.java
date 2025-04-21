package io.goorm.backend.dto.kernel;

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
    private String last_activity;
    private String execution_state;
    private int connections;
}