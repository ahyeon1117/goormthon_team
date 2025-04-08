package io.goorm.backend.controller;

import io.goorm.backend.dto.WishItemDto;
import io.goorm.backend.dto.req.ReqAddWishItem;
import io.goorm.backend.dto.req.ReqDeleteWishItem;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ResAddWishItem;
import io.goorm.backend.dto.res.ResDeleteWishItem;
import io.goorm.backend.dto.res.ResGetWishItems;
import io.goorm.backend.service.WishService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wish")
public class WishController {

    private final WishService wishService;

    /**
     * 찜하기에 상품을 추가합니다.
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ResAddWishItem>> addItem(
        @Valid @RequestBody ReqAddWishItem requestMessage
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                wishService.addWishItem(WishItemDto.of(requestMessage))
            )
        );
    }

    /**
     * 현재 로그인한 사용자의 찜하기 목록을 조회합니다.
     */
    @GetMapping("/view")
    public ResponseEntity<ApiResponse<ResGetWishItems>> getWishItems() {
        return ResponseEntity.ok(
            ApiResponse.success(wishService.getCurrentUserWishItems())
        );
    }

    /**
     * 찜하기에서 상품을 삭제합니다.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<ResDeleteWishItem>> removeItem(
        @Valid @RequestBody ReqDeleteWishItem requestMessage
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                wishService.deleteWishItem(WishItemDto.of(requestMessage))
            )
        );
    }
}
