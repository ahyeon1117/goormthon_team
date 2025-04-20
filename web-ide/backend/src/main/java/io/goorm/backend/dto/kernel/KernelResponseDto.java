package io.goorm.backend.dto.kernel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class KernelResponseDto {
    private String id;
    private String name;
}
