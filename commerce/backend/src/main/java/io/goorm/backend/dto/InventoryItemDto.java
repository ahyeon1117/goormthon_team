package io.goorm.backend.dto;

import io.goorm.backend.entity.InventoryItem;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryItemDto {
    private Long id;
    private Long productId;
    private String productTitle;
    private LocalDateTime lastAccessed;

    public static InventoryItemDto from(InventoryItem inventoryItem) {
        return InventoryItemDto.builder()
                .id(inventoryItem.getId())
                .productId(inventoryItem.getProduct().getId())
                .productTitle(inventoryItem.getProduct().getTitle())
                .lastAccessed(inventoryItem.getLastAccessed())
                .build();
    }
}
