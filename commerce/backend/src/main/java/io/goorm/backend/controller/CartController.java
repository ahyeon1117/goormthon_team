package io.goorm.backend.controller;

import io.goorm.backend.dto.CartItemDto;
import io.goorm.backend.dto.req.ReqAddNewProduct;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ResAddNewProductToCart;
import io.goorm.backend.entity.CartItem;
import io.goorm.backend.service.CartService;
import io.goorm.backend.service.JwtService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;
    private final JwtService jwtService;

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

    @GetMapping("/view")
    public ResponseEntity<ApiResponse<List<CartItem>>> view() {
        String userId = jwtService.getUserId();
        return ResponseEntity.ok(
            ApiResponse.success(cartService.getCartItems(userId))
        );
    }

    @DeleteMapping("/delete/item/{productId}")
    public ResponseEntity<ApiResponse<String>> deleteItem(
        @PathVariable String productId
    ) {
        String userId = jwtService.getUserId();
        cartService.removeCartItem(userId, productId);
        return ResponseEntity.ok(
            ApiResponse.success("Item removed successfully")
        );
    }
}
