package io.goorm.backend.dto;

import io.goorm.backend.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String title;
    private String link;
    private String image;
    private String author;
    private BigDecimal discount;
    private String publisher;
    private String pubdate;
    private String isbn;
    private String description;

    public static ProductDto from(Product product) {
        return ProductDto.builder()
            .id(product.getId())
            .title(product.getTitle())
            .link(product.getLink())
            .image(product.getImage())
            .author(product.getAuthor())
            .discount(product.getDiscount())
            .publisher(product.getPublisher())
            .pubdate(product.getPubdate())
            .isbn(product.getIsbn())
            .description(product.getDescription())
            .build();
    }
} 
