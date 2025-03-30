package io.goorm.backend.service;

import io.goorm.backend.dto.res.OrderResponse;
import io.goorm.backend.entity.*;
import io.goorm.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final JwtService jwtService;
    private final UserService userService;
    private final ProductService productService;
    private final CartService cartService;

    /**
     * 주문 생성
     */
    @Transactional
    public OrderResponse createOrder(String paymentMethod, List<Long> productIdList) {
        // 유저 조회
        String userId = jwtService.getUserId(); // 현재 로그인한 유저 정보
        User user = userService.findById(userId);

        // 상품 조회
        List<OrderItem> orderItems = productIdList.stream()
            .map(id -> {
                Product product = productService.findProductById(id);
                return new OrderItem(product, product.getDiscount()); // 주문 상품 생성
            })
            .collect(Collectors.toList());
        
        // 총 금액 계산
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (OrderItem orderItem : orderItems) {
            totalPrice = totalPrice.add(orderItem.getProduct().getDiscount());
        }

        // 주문 생성
        Order order = Order.createOrder(user, totalPrice, paymentMethod, orderItems.toArray(new OrderItem[0]));

        // 주문 저장
        orderRepository.save(order);

        // 장바구니에 해당 상품이 있다면 삭제
        cartService.removeCartItems(user, productIdList);

        return OrderResponse.from(order);
    }

    /**
     * 주문 취소
     */
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다."));
        order.cancel();
    }

}
