package io.goorm.backend.service;

import io.goorm.backend.dto.res.ProductRes;
import io.goorm.backend.entity.Product;
import io.goorm.backend.repository.ProductRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  public List<ProductRes> findAllProduct() {
    List<Product> products = productRepository.findAll();
    List<ProductRes> result = products
      .stream()
      .map(product -> {
        ProductRes res = new ProductRes();
        BeanUtils.copyProperties(product, res);
        return res;
      })
      .collect(Collectors.toList());
    return result;
  }
}
