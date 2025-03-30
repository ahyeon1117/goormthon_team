package io.goorm.backend.controller;

import io.goorm.backend.dto.req.CartOrderRequest;
import io.goorm.backend.dto.req.DirectOrderRequest;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.OrderResponse;
import io.goorm.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {

   private final OrderService orderService;

   @PostMapping("/direct")
   public ResponseEntity<ApiResponse<OrderResponse>> createDirectOrder(
    @Valid @RequestBody DirectOrderRequest requestMessage
   ) {
      return ResponseEntity.ok(
         ApiResponse.success(
            orderService.createDirectOrder(requestMessage.getProductId(), requestMessage.getPaymentMethod())
         )
      );
   }
   
   @PostMapping("/cart")
   public ResponseEntity<ApiResponse<OrderResponse>> createOrderFromCart(
    @Valid @RequestBody CartOrderRequest requestMessage
   ) {
      return ResponseEntity.ok(
         ApiResponse.success(
            orderService.createOrderFromCart(requestMessage.getPaymentMethod())
         )
      );
   }
}
