package io.goorm.backend.dto;

import io.goorm.backend.dto.req.ReqAddNewProduct;
import io.goorm.backend.dto.req.ReqDeleteProduct;
import io.goorm.backend.dto.req.ReqDeleteProductList;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@RequiredArgsConstructor
public class CartItemDto {

    private final Long productId;

    public static CartItemDto of(ReqAddNewProduct requestDto) {
        return CartItemDto.builder()
            .productId(requestDto.getProductId())
            .build();
    }

    public static CartItemDto of(ReqDeleteProduct requestDto) {
        return CartItemDto.builder()
            .productId(requestDto.getProductId())
            .build();
    }

    public static List<CartItemDto> listOf(ReqDeleteProductList requestDto) {
        return requestDto.getProductIdList().stream()
            .map(productId -> CartItemDto.builder()
                .productId(productId)
                .build())
            .collect(Collectors.toList());
    }
}
