package io.goorm.backend.service;

import io.goorm.backend.dto.InventoryItemDto;
import io.goorm.backend.dto.res.ResGetInventoryItems;
import io.goorm.backend.entity.Inventory;
import io.goorm.backend.entity.InventoryItem;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final UserService userService;
    private final JwtService jwtService;

    /**
     * 회원가입 시 호출되어 새로운 사용자의 인벤토리를 생성합니다.
     */
    @Transactional
    public Inventory createInventoryForUser(User user) {
        Inventory inventory = Inventory.builder()
                .user(user)
                .itemsCount(0L)
                .build();

        return inventoryRepository.save(inventory);
    }

    /**
     * 현재 로그인한 사용자의 인벤토리 아이템 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public ResGetInventoryItems getCurrentUserInventoryItems() {
        String userId = jwtService.getUserId();
        User user = userService.findById(userId);
        Inventory inventory = inventoryRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("사용자의 인벤토리를 찾을 수 없습니다."));

        // 인벤토리 아이템 목록 가져오기
        List<InventoryItem> inventoryItems = inventory.getInventoryItems();

        // 엔티티를 DTO로 변환
        List<InventoryItemDto> inventoryItemDtos = inventoryItems.stream()
                .map(InventoryItemDto::from)
                .collect(Collectors.toList());

        // 응답 DTO 생성 및 반환
        return ResGetInventoryItems.of(inventoryItemDtos);
    }
}
