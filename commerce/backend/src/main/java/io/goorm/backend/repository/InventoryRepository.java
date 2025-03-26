package io.goorm.backend.repository;

import io.goorm.backend.entity.Inventory;
import io.goorm.backend.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends CrudRepository<Inventory, Long> {
    Optional<Inventory> findByUser(User user);
}
