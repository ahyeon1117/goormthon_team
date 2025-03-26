package io.goorm.backend.repository;

import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.Wish;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishRepository extends CrudRepository<Wish, Long> {
    List<Wish> findByUser(User user);
    Optional<Wish> findByUserAndProduct(User user, Product product);
}
