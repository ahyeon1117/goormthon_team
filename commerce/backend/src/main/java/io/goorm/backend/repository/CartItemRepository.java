package io.goorm.backend.repository;

import io.goorm.backend.entity.Cart;
import io.goorm.backend.entity.CartItem;
import io.goorm.backend.entity.Product;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface CartItemRepository extends CrudRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
