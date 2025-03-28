package io.goorm.backend.controller;

import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.res.ProductResponse;
import io.goorm.backend.service.ProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProduct() {
        return ResponseEntity.ok(
            ApiResponse.success(productService.getAllProduct())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(productService.getProductById(id))
        );
    }

    // @GetMapping("/isbn/{isbn}")
    // public ResponseEntity<ApiResponse<ProductResponse>> getProductByIsbn(
    //     @PathVariable String isbn
    // ) {
    //     return ResponseEntity.ok(
    //         ApiResponse.success(productService.getProductByIsbn(isbn))
    //     );
    // }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
        @RequestParam String keyword
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(productService.searchProducts(keyword))
        );
    }

    @GetMapping("/new")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNewProducts() {
        return ResponseEntity.ok(
            ApiResponse.success(productService.getNewProducts())
        );
    }

}
