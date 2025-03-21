package io.goorm.backend.controller;

import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ProductRes;
import io.goorm.backend.service.ProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping
  public ResponseEntity<ApiResponse<List<ProductRes>>> getProduct() {
    return ResponseEntity.ok(
      ApiResponse.success(productService.findAllProduct())
    );
  }
}
