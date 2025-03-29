package io.goorm.backend.dto.req;

import io.goorm.backend.dto.CartItemDto;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReqDeleteProductList {

    @NotEmpty
    private List<Long> productIdList;

    public List<CartItemDto> toCartItemDtoList() {
        return productIdList.stream()
            .map(CartItemDto::new)
            .collect(Collectors.toList());
    }
    
}
