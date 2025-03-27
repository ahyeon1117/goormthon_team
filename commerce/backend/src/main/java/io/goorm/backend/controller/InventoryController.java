package io.goorm.backend.controller;

import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ResGetInventoryItems;
import io.goorm.backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * 현재 로그인한 사용자의 인벤토리(서재) 아이템 목록을 조회합니다.
     * 인증된 사용자만 자신의 인벤토리에 접근할 수 있습니다.
     */
    @GetMapping("/view")
    public ResponseEntity<ApiResponse<ResGetInventoryItems>> getUserInventory() {
        return ResponseEntity.ok(
            ApiResponse.success(inventoryService.getCurrentUserInventoryItems())
        );
    }
}
