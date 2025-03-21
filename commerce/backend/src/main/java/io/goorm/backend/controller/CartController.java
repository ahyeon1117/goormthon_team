package io.goorm.backend.controller;

import io.goorm.backend.dto.WishItem;
import io.goorm.backend.dto.req.ReqAddNewProduct;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ResAddNewProductToCart;
import io.goorm.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {

  private final CartService cartService;

  @PostMapping("/add")
  public ResponseEntity<ApiResponse<ResAddNewProductToCart>> addItem(
    @Valid @RequestBody ReqAddNewProduct requestMessage
  ) {
    return ResponseEntity.ok(
      ApiResponse.success(
        cartService.addNewProductToCart(WishItem.of(requestMessage))
      )
    );
  }

  @GetMapping("/view")
  public ResponseEntity<ApiResponse<?>> view(
    @RequestBody ReqAddNewProduct requestMessage
  ) {
    return ResponseEntity.ok(
      ApiResponse.success(
        cartService.addNewProductToCart(WishItem.of(requestMessage))
      )
    );
  }

  @PostMapping("/delete/item")
  public ResponseEntity<ApiResponse<?>> delete(
    @RequestBody ReqAddNewProduct requestMessage
  ) {
    return ResponseEntity.ok(
      ApiResponse.success(
        cartService.addNewProductToCart(WishItem.of(requestMessage))
      )
    );
  }
}
