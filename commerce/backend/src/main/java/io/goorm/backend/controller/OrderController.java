package io.goorm.backend.controller;

import io.goorm.backend.dto.ProductDto;
import io.goorm.backend.dto.req.OrderRequest;
import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.OrderResponse;
import io.goorm.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {

   private final OrderService orderService;

   /*
    * 주문 생성
    */
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

   /**
    * 주문 전체 조회
    */
   @GetMapping("/view")
   public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders() {
      return ResponseEntity.ok(
         ApiResponse.success(
            orderService.getOrders()
         )
      );
   }

      /**
    * 현재 로그인한 사용자의 주문 상품 목록 조회
    */
    @GetMapping("/view-items")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getCurrentUserOrderItems() {
       return ResponseEntity.ok(
          ApiResponse.success(
             orderService.getCurrentUserOrderProductDtos()
          )
       );
    }
}
