package io.goorm.backend.repository;

import io.goorm.backend.entity.Product;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface ProductRepository extends CrudRepository<Product, Long> {
    // Optional<Product> findByIsbn(String isbn);
    List<Product> findByTitleContainingOrAuthorContainingOrPublisherContaining(
        String title,
        String author,
        String publisher
    );

    List<Product> findTop15ByOrderByPubdateDesc();
}
