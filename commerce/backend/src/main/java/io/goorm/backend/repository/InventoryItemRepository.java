package io.goorm.backend.repository;

import io.goorm.backend.entity.InventoryItem;
import io.goorm.backend.entity.Inventory;
import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryItemRepository extends CrudRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByInventoryAndProduct(Inventory inventory, Product product);
}
