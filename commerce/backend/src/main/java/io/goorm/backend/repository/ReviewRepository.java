package io.goorm.backend.repository;

import io.goorm.backend.entity.Review;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Long> {
    List<Review> findByUser(User user);
    List<Review> findByProduct(Product product);
    Optional<Review> findByUserAndProduct(User user, Product product);
}
