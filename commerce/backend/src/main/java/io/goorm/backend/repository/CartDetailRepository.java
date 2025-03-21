package io.goorm.backend.repository;

import io.goorm.backend.entity.CartDetail;
import org.springframework.data.repository.CrudRepository;

public interface CartDetailRepository
  extends CrudRepository<CartDetail, Long> {}
