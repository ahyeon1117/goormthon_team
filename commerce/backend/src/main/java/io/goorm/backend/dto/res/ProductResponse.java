package io.goorm.backend.dto.res;

import io.goorm.backend.entity.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {

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

    //DTO와 Entity의 분리 (데이터베이스와의 상호작용을 담당하는 엔티티)
    public ProductResponse(Product product) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.link = product.getLink();
        this.image = product.getImage();
        this.author = product.getAuthor();
        this.discount = product.getDiscount();
        this.publisher = product.getPublisher();
        this.pubdate = product.getPubdate();
        this.isbn = product.getIsbn();
        this.description = product.getDescription();
    }
}
