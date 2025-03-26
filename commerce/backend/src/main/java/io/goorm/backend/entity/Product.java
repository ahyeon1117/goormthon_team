package io.goorm.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products",
       indexes = {
           @Index(name = "idx_product_title", columnList = "title"),
           @Index(name = "idx_product_author", columnList = "author"),
           @Index(name = "idx_product_publisher", columnList = "publisher"),
           @Index(name = "idx_product_search", columnList = "title, author, publisher")
       })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String link;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false)
    private String publisher;

    @Column(nullable = false)
    private String pubdate;

    @Column(nullable = false, unique = true)
    private String isbn;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Product(String title, String link, String image, String author, BigDecimal discount,
                  String publisher, String pubdate, String isbn, String description) {
        this.title = title;
        this.link = link;
        this.image = image;
        this.author = author;
        this.discount = discount;
        this.publisher = publisher;
        this.pubdate = pubdate;
        this.isbn = isbn;
        this.description = description;
    }
} 
