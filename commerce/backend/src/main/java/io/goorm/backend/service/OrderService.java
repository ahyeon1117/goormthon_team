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
     * 바로 구매 (장바구니에 담지 않고 바로 구매)
     */
    @Transactional
    public OrderResponse createDirectOrder(Long productId, String paymentMethod) {
        // 유저 조회
        String userId = jwtService.getUserId(); // 현재 로그인한 유저 정보
        User user = userService.findById(userId);

        // 상품 조회
        Product product = productService.findProductById(productId);

        // 주문상품 생성
        OrderItem orderItem = new OrderItem(product, product.getDiscount());

        // 주문 생성
        Order order = Order.createOrder(user, product.getDiscount(), paymentMethod, orderItem);

        // 주문 저장
        orderRepository.save(order);

        return OrderResponse.from(order);
    }

    /**
     * 장바구니 주문
     */
    @Transactional
    public OrderResponse createOrderFromCart(String paymentMethod) {
        // 유저 조회
        String userId = jwtService.getUserId(); // 현재 로그인한 유저 정보
        User user = userService.findById(userId);

        // 유저의 장바구니 목록 조회
        List<CartItem> cartItems = cartService.getCartItems(user);

        // 각 장바구니 아이템을 바탕으로 OrderItem 생성
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> {
                    Product product = cartItem.getProduct(); // 상품 정보 조회
                    return new OrderItem(product, product.getDiscount());
                })
                .collect(Collectors.toList());
        
        // 총 금액 계산
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            totalPrice = totalPrice.add(cartItem.getProduct().getDiscount());
        }

        // 주문 생성
        Order order = Order.createOrder(user, totalPrice, paymentMethod, orderItems.toArray(new OrderItem[0]));

        // 주문 저장
        orderRepository.save(order);

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
