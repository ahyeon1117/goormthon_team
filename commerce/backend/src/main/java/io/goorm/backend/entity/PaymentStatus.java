package io.goorm.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PaymentStatus {
    PENDING(1),
    COMPLETED(2),
    FAILED(4),
    REFUNDED(5);

    private final int value;

    public static PaymentStatus valueOf(int value) {
        return switch (value) {
            case 1 -> PENDING;
            case 2 -> COMPLETED;
            case 4 -> FAILED;
            case 5 -> REFUNDED;
            default -> throw new IllegalArgumentException(
                "유효하지 않은 결제 상태 값: " + value
            );
        };
    }
}
