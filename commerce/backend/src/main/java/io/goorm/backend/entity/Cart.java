package io.goorm.backend.entity;

import jakarta.persistence.*;
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
@Table(name = "carts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart {

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

    @OneToMany(
        mappedBy = "cart",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<CartItem> cartItems = new ArrayList<>();

    @Builder
    public Cart(User user, Long itemsCount) {
        this.user = user;
        this.itemsCount = itemsCount != null ? itemsCount : 0L;
    }

    public void addCartItem(CartItem cartItem) {
        this.cartItems.add(cartItem);
        cartItem.setCart(this);
        this.itemsCount++;
    }

    public void removeCartItem(CartItem cartItem) {
        this.cartItems.remove(cartItem);
        this.itemsCount = Math.max(0, this.itemsCount - 1);
    }

    public void clearCart() {
        this.cartItems.clear();
        this.itemsCount = 0L;
    }
}
