package io.goorm.backend.dto.res;

import io.goorm.backend.entity.Wish;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResGetWishItems {
    private final List<ResWishItemDto> wishItems;
    private final int totalCount;

    public static ResGetWishItems of(List<Wish> wishes) {
        List<ResWishItemDto> wishItemDtos = wishes.stream()
                .map(ResWishItemDto::from)
                .collect(Collectors.toList());

        return ResGetWishItems.builder()
                .wishItems(wishItemDtos)
                .totalCount(wishItemDtos.size())
                .build();
    }
}
