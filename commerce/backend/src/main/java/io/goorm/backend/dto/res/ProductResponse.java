package io.goorm.backend.dto.res;

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
}
