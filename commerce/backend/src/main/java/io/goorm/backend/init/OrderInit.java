package io.goorm.backend.init;

import io.goorm.backend.entity.Order;
import io.goorm.backend.entity.OrderItem;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.OrderRepository;
import io.goorm.backend.repository.ProductRepository;
import io.goorm.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@DependsOn({"userInit", "productInit"}) // UserInit과 ProductInit이 먼저 실행된 후 실행되도록 의존성 설정
public class OrderInit {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // goorm 계정 조회
        Optional<User> userOptional = userRepository.findById("goorm");

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 이미 주문이 있는지 확인
            if (orderRepository.findByUser(user).isEmpty()) {
                // 첫 번째 주문을 위한 상품 ID 목록
                List<Long> firstOrderProductIds = Arrays.asList(30L, 31L, 32L, 33L, 34L, 35L);
                createOrder(user, firstOrderProductIds, 1L);

                // 두 번째 주문을 위한 상품 ID 목록
                List<Long> secondOrderProductIds = Arrays.asList(36L, 37L, 38L, 39L, 40L);
                createOrder(user, secondOrderProductIds, 2L);

                System.out.println("goorm 계정에 주문이 생성되었습니다.");
            } else {
                System.out.println("goorm 계정에 이미 주문이 존재합니다.");
            }
        } else {
            System.out.println("goorm 계정을 찾을 수 없습니다.");
        }
    }

    private void createOrder(User user, List<Long> productIds, Long orderId) {
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (Long productId : productIds) {
            Optional<Product> productOptional = productRepository.findById(productId);

            if (productOptional.isPresent()) {
                Product product = productOptional.get();
                BigDecimal price = product.getDiscount() != null ? product.getDiscount() : BigDecimal.ZERO;
                
                // 주문 아이템 생성
                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .price(price)
                        .build();
                
                orderItems.add(orderItem);
                totalPrice = totalPrice.add(price);
            } else {
                System.out.println("상품을 찾을 수 없습니다: ID " + productId);
            }
        }

        if (!orderItems.isEmpty()) {
            // 주문 생성
            Order order = Order.createOrder(
                    user,
                    totalPrice,
                    "creditCard", // 결제 방법
                    orderItems.toArray(new OrderItem[0])
            );
            
            // ID 수동 설정 (테스트 목적)
            try {
                java.lang.reflect.Field field = Order.class.getDeclaredField("id");
                field.setAccessible(true);
                field.set(order, orderId);
            } catch (Exception e) {
                System.out.println("주문 ID 설정 중 오류 발생: " + e.getMessage());
            }
            
            // 주문 저장
            orderRepository.save(order);
        }
    }
} 
