package io.goorm.backend.service;

import io.goorm.backend.dto.res.ProductResponse;
import io.goorm.backend.entity.Product;
import io.goorm.backend.repository.ProductRepository;
import java.util.Iterator;
import java.util.List;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  public List<ProductResponse> findAllProduct() {
    Iterator<Product> products = productRepository.findAll().iterator();
    List<ProductResponse> result = StreamSupport
      .stream(
        Spliterators.spliteratorUnknownSize(products, Spliterator.ORDERED),
        false
      )
      .map(product -> {
        ProductResponse res = new ProductResponse();
        BeanUtils.copyProperties(product, res);
        return res;
      })
      .collect(Collectors.toList());
    return result;
  }

  public Product getProductById(String id) {
    return productRepository.findById(id).orElseThrow();
  }
}
