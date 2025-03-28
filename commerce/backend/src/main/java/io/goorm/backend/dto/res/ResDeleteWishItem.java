package io.goorm.backend.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResDeleteWishItem {
    private final String result;

    public static ResDeleteWishItem success() {
        return ResDeleteWishItem.builder()
                .result("success")
                .build();
    }

    public static ResDeleteWishItem itemNotExists() {
        return ResDeleteWishItem.builder()
                .result("item not exists")
                .build();
    }
}
