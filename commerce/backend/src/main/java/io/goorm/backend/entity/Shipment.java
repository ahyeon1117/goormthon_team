package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "ordersheet_id", unique = true)
    private OrderSheet orderSheet;

    @Column(name = "tracking_number", nullable = false, unique = true)
    private String trackingNumber;

    @Column(length = 100)
    private String carrier;

    @Column(length = 20)
    private String status;

    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
