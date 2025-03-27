package io.goorm.backend.dto.res;

import io.goorm.backend.entity.CartItem;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResCartItemDto {
    private Long id;
    private Long productId;
    private String title;
    private String image;
    private String author;
    private BigDecimal discount;
    private String publisher;
    private LocalDateTime createdAt;

    public static ResCartItemDto from(CartItem cartItem) {
        return ResCartItemDto.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .title(cartItem.getProduct().getTitle())
                .image(cartItem.getProduct().getImage())
                .author(cartItem.getProduct().getAuthor())
                .discount(cartItem.getProduct().getDiscount())
                .publisher(cartItem.getProduct().getPublisher())
                .createdAt(cartItem.getCreatedAt())
                .build();
    }
}
