package io.goorm.backend.controller;

import io.goorm.backend.dto.CartItemDto;
import io.goorm.backend.dto.req.ReqAddNewProduct;
import io.goorm.backend.dto.req.ReqDeleteProduct;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ResAddNewProductToCart;
import io.goorm.backend.dto.res.ResDeleteProductFromCart;
import io.goorm.backend.dto.res.ResGetCartItems;
import io.goorm.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.goorm.backend.dto.req.ReqDeleteProductList;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    /**
     * 장바구니에 상품을 추가합니다.
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ResAddNewProductToCart>> addItem(
        @Valid @RequestBody ReqAddNewProduct requestMessage
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                cartService.addNewProductToCart(CartItemDto.of(requestMessage))
            )
        );
    }

    /**
     * 현재 로그인한 사용자의 장바구니 목록을 조회합니다.
     */
    @GetMapping("/view")
    public ResponseEntity<ApiResponse<ResGetCartItems>> getCartItems() {
        return ResponseEntity.ok(
            ApiResponse.success(cartService.getCurrentUserCartItems())
        );
    }

    /**
     * 장바구니에서 단일 상품을 삭제합니다.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<ResDeleteProductFromCart>> removeItem(
        @Valid @RequestBody ReqDeleteProduct requestMessage
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                cartService.deleteProductFromCart(CartItemDto.of(requestMessage))
            )
        );
    }

    /**
     * 장바구니에서 여러 상품을 삭제합니다.
     */
    @DeleteMapping("/remove-multiple")
    public ResponseEntity<ApiResponse<ResDeleteProductFromCart>> removeItemList(
        @Valid @RequestBody ReqDeleteProductList requestMessage
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                cartService.deleteProductListFromCart(CartItemDto.listOf(requestMessage))
            )
        );
    }
}
