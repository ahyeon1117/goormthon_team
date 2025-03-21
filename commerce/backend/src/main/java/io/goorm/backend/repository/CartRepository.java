package io.goorm.backend.repository;

import io.goorm.backend.entity.Cart;
import org.springframework.data.repository.CrudRepository;

public interface CartRepository extends CrudRepository<Cart, Long> {}
