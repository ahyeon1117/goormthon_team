package io.goorm.backend.dto.req;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    @NotEmpty
    private List<Long> productIdList;
    
    @NotEmpty
    private String paymentMethod;

}
