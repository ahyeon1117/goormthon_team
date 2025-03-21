package io.goorm.backend.repository;

import io.goorm.backend.entity.Product;
import org.springframework.data.repository.CrudRepository;

public interface ProductRepository extends CrudRepository<Product, String> {}
