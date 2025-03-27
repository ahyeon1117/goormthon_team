package io.goorm.backend.dto.res;

import io.goorm.backend.entity.CartItem;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResGetCartItems {
    private final List<ResCartItemDto> cartItems;
    private final int totalCount;

    public static ResGetCartItems of(List<CartItem> cartItems) {
        List<ResCartItemDto> cartItemDtos = cartItems.stream()
                .map(ResCartItemDto::from)
                .collect(Collectors.toList());

        return ResGetCartItems.builder()
                .cartItems(cartItemDtos)
                .totalCount(cartItemDtos.size())
                .build();
    }
}
