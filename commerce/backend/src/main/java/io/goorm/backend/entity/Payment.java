package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true, nullable = false)
    private Order order;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "transaction_id", nullable = false, unique = true)
    private String transactionId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Payment(String paymentMethod, PaymentStatus status, String transactionId, BigDecimal amount, LocalDateTime paymentDate) {
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.amount = amount;
        this.paymentDate = paymentDate;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void updateStatus(PaymentStatus status) {
        this.status = status;
    }

    public void completePayment(LocalDateTime paymentDate) {
        this.status = PaymentStatus.COMPLETED;
        this.paymentDate = paymentDate;
    }
} 
