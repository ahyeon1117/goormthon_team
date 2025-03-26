package io.goorm.backend.repository;

import io.goorm.backend.entity.Cart;
import io.goorm.backend.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CartRepository extends CrudRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
