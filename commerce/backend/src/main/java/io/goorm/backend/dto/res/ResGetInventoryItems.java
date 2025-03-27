package io.goorm.backend.dto.res;

import io.goorm.backend.dto.InventoryItemDto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResGetInventoryItems {
    private final List<InventoryItemDto> inventoryItems;
    private final int totalCount;

    public static ResGetInventoryItems of(List<InventoryItemDto> inventoryItems) {
        return ResGetInventoryItems.builder()
                .inventoryItems(inventoryItems)
                .totalCount(inventoryItems.size())
                .build();
    }
}
