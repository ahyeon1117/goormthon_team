package io.goorm.backend.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResDeleteProductFromCart {
    private final String result;

    public static ResDeleteProductFromCart success() {
        return ResDeleteProductFromCart.builder()
                .result("success")
                .build();
    }

    public static ResDeleteProductFromCart itemNotExists() {
        return ResDeleteProductFromCart.builder()
                .result("item not exists")
                .build();
    }
}
