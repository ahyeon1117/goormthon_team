package io.goorm.backend.repository;

import io.goorm.backend.entity.Order;
import io.goorm.backend.entity.OrderStatus;
import io.goorm.backend.entity.User;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserAndStatus(User user, OrderStatus status);
}
