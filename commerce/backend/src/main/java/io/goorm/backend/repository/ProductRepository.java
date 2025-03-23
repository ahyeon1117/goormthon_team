package io.goorm.backend.repository;

import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;
import java.util.List;

public interface ProductRepository extends CrudRepository<Product, String> {
    Optional<Product> findByIsbn(String isbn);
    List<Product> findByTitleContainingOrAuthorContainingOrPublisherContaining(String title, String author, String publisher);
}
