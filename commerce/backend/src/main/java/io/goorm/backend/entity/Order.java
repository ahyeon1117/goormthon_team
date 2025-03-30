package io.goorm.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
    name = "orders",
    indexes = { @Index(name = "idx_order_user", columnList = "user_id") }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false)
    private OrderStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<OrderItem> orderItems = new ArrayList<>();

    // 결제 기능 구현 전, 임시 필드
    private String paymentMethod; // "rocketPay", "creditCard", "bankTransfer", "accountTransfer"

    // 결제 기능 구현 시 필요
    // @OneToOne(
    //     mappedBy = "order",
    //     cascade = CascadeType.ALL,
    //     orphanRemoval = true
    // )
    // private Payment payment;

    // Order 객체 생성은 createOrder 메서드로 생성하도록 생성자와 빌더는 protected로 제한
    @Builder(access = AccessLevel.PROTECTED)
    protected Order(User user, BigDecimal totalPrice, OrderStatus status, String paymentMethod) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.status = status;
        this.paymentMethod = paymentMethod;
    }

    public void addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    // 결제 기능 구현 시 필요
    // public void setPayment(Payment payment) {
    //     this.payment = payment;
    //     payment.setOrder(this);
    // }

    public void updateStatus(OrderStatus status) {
        this.status = status;
    }

    /**
     * 주문 생성 메서드
     */
    public static Order createOrder(User user, BigDecimal totalPrice, String paymentMethod, OrderItem... orderItems) {
        Order order = Order.builder()
            .user(user)
            .totalPrice(totalPrice)
            .status(OrderStatus.COMPLETED) // 주문 기능 구현 전: 초기 배송 상테
//            .status(OrderStatus.PENDING) // 주문 기능 구현 시 변경
            .paymentMethod(paymentMethod)
            .build();

        // 양방향 연관관계 설정
        for (OrderItem orderItem : orderItems) {
            order.addOrderItem(orderItem);
        }
        return order;
    }

    /**
     * 주문 취소 비즈니스 로직
     */
    // [수정 2]
    public void cancel() {
        // 취소 제한 조건 추가해야 할지? (예를 들면, 주문한 책을 읽은 경우 취소 불가)
        // if (this.status == OrderStatus.COMPLETED) {
        //     throw new IllegalStateException("이미 완료된 주문입니다.");
        // }
        this.updateStatus(OrderStatus.CANCELLED);
    }

}
