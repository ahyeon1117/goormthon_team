package io.goorm.backend.dto;

import io.goorm.backend.dto.req.ReqAddWishItem;
import io.goorm.backend.dto.req.ReqDeleteWishItem;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class WishItemDto {

    private final Long productId;

    public static WishItemDto of(ReqAddWishItem requestDto) {
        return WishItemDto.builder()
            .productId(requestDto.getProductId())
            .build();
    }

    public static WishItemDto of(ReqDeleteWishItem requestDto) {
        return WishItemDto.builder()
            .productId(requestDto.getProductId())
            .build();
    }
} 
