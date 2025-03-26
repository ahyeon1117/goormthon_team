package io.goorm.backend.repository;

import io.goorm.backend.entity.Order;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.OrderStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserAndStatus(User user, OrderStatus status);
}
