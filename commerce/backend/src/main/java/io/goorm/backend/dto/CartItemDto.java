package io.goorm.backend.dto;

import io.goorm.backend.dto.req.ReqAddNewProduct;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class CartItemDto {

  private final String productId;

  public static CartItemDto of(ReqAddNewProduct requestDto) {
    return CartItemDto
      .builder()
      .productId(requestDto.getProductId())
      .build();
  }
}
