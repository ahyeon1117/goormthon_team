package io.goorm.backend.repository;

import io.goorm.backend.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, String> {}
