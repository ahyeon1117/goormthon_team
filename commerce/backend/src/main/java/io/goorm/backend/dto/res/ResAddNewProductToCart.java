package io.goorm.backend.dto.res;

import lombok.*;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class ResAddNewProductToCart {

    private String result;

    public static ResAddNewProductToCart success() {
        return ResAddNewProductToCart.builder()
                .result("success")
                .build();
    }

    public static ResAddNewProductToCart itemAlreadyExists() {
        return ResAddNewProductToCart.builder()
                .result("item already exists")
                .build();
    }
}
