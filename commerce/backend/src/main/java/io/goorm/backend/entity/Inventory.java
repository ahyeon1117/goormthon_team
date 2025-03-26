package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "items_count", nullable = false)
    private Long itemsCount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryItem> inventoryItems = new ArrayList<>();

    @Builder
    public Inventory(User user, Long itemsCount) {
        this.user = user;
        this.itemsCount = itemsCount != null ? itemsCount : 0L;
    }

    public void addInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItems.add(inventoryItem);
        inventoryItem.setInventory(this);
        this.itemsCount++;
    }

    public void removeInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItems.remove(inventoryItem);
        this.itemsCount = Math.max(0, this.itemsCount - 1);
    }
} 
