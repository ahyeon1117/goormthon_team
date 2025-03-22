package io.goorm.backend.repository;

import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface ProductRepository extends CrudRepository<Product, String> {
    Optional<Product> findByIsbn(String isbn);
}
