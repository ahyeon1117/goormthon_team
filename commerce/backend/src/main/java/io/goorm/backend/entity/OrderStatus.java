package io.goorm.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrderStatus {
    PENDING(1),
    COMPLETED(2),
    CANCELLED(3),
    REFUNDED(5);

    private final int value;

    public static OrderStatus valueOf(int value) {
        return switch (value) {
            case 1 -> PENDING;
            case 2 -> COMPLETED;
            case 3 -> CANCELLED;
            case 5 -> REFUNDED;
            default -> throw new IllegalArgumentException(
                "유효하지 않은 주문 상태 값: " + value
            );
        };
    }
}
