package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items",
       uniqueConstraints = {
           @UniqueConstraint(name = "inventory_product_unique", columnNames = {"inventory_id", "product_id"})
       })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public InventoryItem(Product product, OrderItem orderItem, LocalDateTime lastAccessed) {
        this.product = product;
        this.orderItem = orderItem;
        this.lastAccessed = lastAccessed != null ? lastAccessed : LocalDateTime.now();
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }

    public void updateLastAccessed() {
        this.lastAccessed = LocalDateTime.now();
    }
} 
