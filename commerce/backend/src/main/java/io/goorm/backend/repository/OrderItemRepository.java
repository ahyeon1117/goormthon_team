package io.goorm.backend.repository;

import io.goorm.backend.entity.OrderItem;
import io.goorm.backend.entity.Order;
import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends CrudRepository<OrderItem, Long> {
    OrderItem findByOrderAndProduct(Order order, Product product);
}
