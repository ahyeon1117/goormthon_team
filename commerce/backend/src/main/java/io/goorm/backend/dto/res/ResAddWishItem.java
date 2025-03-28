package io.goorm.backend.dto.res;

import lombok.*;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class ResAddWishItem {

    private String result;

    public static ResAddWishItem success() {
        return ResAddWishItem.builder()
                .result("success")
                .build();
    }

    public static ResAddWishItem itemAlreadyExists() {
        return ResAddWishItem.builder()
                .result("item already exists")
                .build();
    }
}
