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
        try {
            // goorm 계정 조회
            Optional<User> userOptional = userRepository.findById("goorm");

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                System.out.println("사용자 조회 성공: " + user.getId());

                // 이미 주문이 있는지 확인
                List<Order> existingOrders = orderRepository.findByUser(user);
                if (existingOrders.isEmpty()) {
                    // 첫 번째 주문을 위한 상품 ID 목록
                    List<Long> firstOrderProductIds = Arrays.asList(30L, 31L, 32L, 33L, 34L, 35L);
                    System.out.println("첫 번째 주문 생성 시도 중...");
                    createOrder(user, firstOrderProductIds);

                    // 두 번째 주문을 위한 상품 ID 목록
                    List<Long> secondOrderProductIds = Arrays.asList(36L, 37L, 38L, 39L, 40L);
                    System.out.println("두 번째 주문 생성 시도 중...");
                    createOrder(user, secondOrderProductIds);

                    System.out.println("goorm 계정에 주문이 생성되었습니다.");
                } else {
                    System.out.println("goorm 계정에 이미 " + existingOrders.size() + "개의 주문이 존재합니다.");
                }
            } else {
                System.out.println("goorm 계정을 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            System.out.println("주문 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createOrder(User user, List<Long> productIds) {
        System.out.println("주문 생성 시작");
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (Long productId : productIds) {
            System.out.println("상품 ID " + productId + " 처리 중...");
            Optional<Product> productOptional = productRepository.findById(productId);

            if (productOptional.isPresent()) {
                Product product = productOptional.get();
                // discount 값이 null이 아니면 해당 값을 사용, null이면 경고 출력 후 0으로 설정
                BigDecimal price;
                if (product.getDiscount() != null) {
                    price = product.getDiscount();
                    System.out.println("상품 ID " + productId + "의 가격: " + price);
                } else {
                    System.out.println("경고: 상품 ID " + productId + "의 가격이 null입니다. 0으로 설정합니다.");
                    price = BigDecimal.ZERO;
                }

                try {
                    // 주문 아이템 생성
                    OrderItem orderItem = OrderItem.builder()
                            .product(product)
                            .price(price)
                            .build();

                    orderItems.add(orderItem);
                    totalPrice = totalPrice.add(price);
                    System.out.println("상품 ID " + productId + " 주문 아이템 생성 성공");
                } catch (Exception e) {
                    System.out.println("상품 ID " + productId + " 주문 아이템 생성 실패: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("상품을 찾을 수 없습니다: ID " + productId);
            }
        }

        if (!orderItems.isEmpty()) {
            try {
                // 주문 생성
                System.out.println("총 " + orderItems.size() + "개의 상품으로 주문 생성, 총액: " + totalPrice);
                Order order = Order.createOrder(
                        user,
                        totalPrice,
                        "creditCard", // 결제 방법
                        orderItems.toArray(new OrderItem[0])
                );

                // 주문 저장
                Order savedOrder = orderRepository.save(order);
                System.out.println("주문 저장 성공, ID: " + savedOrder.getId());
            } catch (Exception e) {
                System.out.println("주문 생성 중 오류 발생: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("주문 아이템이 없어 주문을 생성하지 않습니다.");
        }
    }
}
