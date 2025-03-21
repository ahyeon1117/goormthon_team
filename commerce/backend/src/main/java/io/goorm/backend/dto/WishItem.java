package io.goorm.backend.dto;

import io.goorm.backend.dto.req.ReqAddNewProduct;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class WishItem {

  private final String productId;
  private final String size;

  public static WishItem of(ReqAddNewProduct requestDto) {
    return WishItem
      .builder()
      .productId(requestDto.getProductId())
      .size(requestDto.getSize())
      .build();
  }
}
