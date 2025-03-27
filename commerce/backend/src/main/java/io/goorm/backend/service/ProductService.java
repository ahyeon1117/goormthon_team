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

    // 외부 API용 (컨트롤러에서 사용)
    public List<ProductResponse> getAllProduct() {
        Iterator<Product> products = productRepository.findAll().iterator();
        List<ProductResponse> result = StreamSupport.stream(
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

    public ProductResponse getProductById(Long id) {
        Product product = productRepository
            .findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "해당 ID의 상품이 존재하지 않습니다: " + id
                )
            );

        ProductResponse productResponse = new ProductResponse();
        BeanUtils.copyProperties(product, productResponse);
        return productResponse;
    }

    // public ProductResponse getProductByIsbn(String isbn) {
    //     Product product = productRepository
    //         .findByIsbn(isbn)
    //         .orElseThrow(() ->
    //             new IllegalArgumentException(
    //                 "해당 ISBN의 상품이 존재하지 않습니다: " + isbn
    //             )
    //         );

    //     ProductResponse productResponse = new ProductResponse();
    //     BeanUtils.copyProperties(product, productResponse);
    //     return productResponse;
    // }

    public List<ProductResponse> searchProducts(String keyword) {
        // 제목, 저자, 출판사로 검색하도록 변경
        List<Product> products =
            productRepository.findByTitleContainingOrAuthorContainingOrPublisherContaining(
                keyword,
                keyword,
                keyword
            );

        // 엔티티를 응답 DTO로 변환
        return products
            .stream()
            .map(product -> {
                ProductResponse res = new ProductResponse();
                BeanUtils.copyProperties(product, res);
                return res;
            })
            .collect(Collectors.toList());
    }

    // 내부 서비스용 (서비스에서 사용)
    public Product findProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() ->
            new IllegalArgumentException("해당 ID의 상품이 존재하지 않습니다: " + id)
        );
    }
}
