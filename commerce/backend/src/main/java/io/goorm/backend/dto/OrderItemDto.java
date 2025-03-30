package io.goorm.backend.dto;

import io.goorm.backend.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class OrderItemDto {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productImage;
    private BigDecimal price;

    public static OrderItemDto from(OrderItem orderItem) {
        return OrderItemDto.builder()
            .id(orderItem.getId())
            .productId(orderItem.getProduct().getId())
            .productTitle(orderItem.getProduct().getTitle())
            .productImage(orderItem.getProduct().getImage())
            .price(orderItem.getPrice())
            .build();
    }
        
}
