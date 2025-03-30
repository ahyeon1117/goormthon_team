package io.goorm.backend.controller;

import io.goorm.backend.dto.req.OrderRequest;
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
   
   @PostMapping("/create")
   public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
    @Valid @RequestBody OrderRequest requestMessage
   ) {
      return ResponseEntity.ok(
         ApiResponse.success(
            orderService.createOrder(requestMessage.getPaymentMethod(), requestMessage.getProductIdList())
         )
      );
   }
   
}
