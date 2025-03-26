package io.goorm.backend.repository;

import io.goorm.backend.entity.Wish;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishRepository extends CrudRepository<Wish, Long> {
    List<Wish> findByUser(User user);
    Optional<Wish> findByUserAndProduct(User user, Product product);
}
