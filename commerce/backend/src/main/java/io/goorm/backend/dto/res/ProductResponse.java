package io.goorm.backend.dto.res;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {

    private String title;
    private String link;
    private String image;
    private String author;
    private Double discount;
    private String publisher;
    private String pubdate;
    private String isbn;
    private String description;
}
