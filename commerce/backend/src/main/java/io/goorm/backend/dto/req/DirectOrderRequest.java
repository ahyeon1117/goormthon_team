package io.goorm.backend.dto.req;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DirectOrderRequest {

    @NotNull
    private Long productId;

    @NotEmpty
    private String paymentMethod;
}
