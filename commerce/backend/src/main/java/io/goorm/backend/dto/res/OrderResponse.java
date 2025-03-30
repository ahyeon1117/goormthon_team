package io.goorm.backend.dto.res;

import io.goorm.backend.dto.OrderItemDto;
import io.goorm.backend.entity.Order;
import io.goorm.backend.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private OrderStatus orderStatus;
    private BigDecimal totalPrice;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private List<OrderItemDto> orderItems;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderStatus(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .orderItems(order.getOrderItems().stream()
                        .map(OrderItemDto::from)
                        .collect(Collectors.toList()))
                .build();
    }
}
