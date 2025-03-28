package io.goorm.backend.dto.res;

import io.goorm.backend.entity.Wish;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResWishItemDto {
    private Long id;
    private Long productId;
    private String title;
    private String image;
    private String author;
    private BigDecimal discount;
    private String publisher;
    private LocalDateTime createdAt;

    public static ResWishItemDto from(Wish wish) {
        return ResWishItemDto.builder()
                .id(wish.getId())
                .productId(wish.getProduct().getId())
                .title(wish.getProduct().getTitle())
                .image(wish.getProduct().getImage())
                .author(wish.getProduct().getAuthor())
                .discount(wish.getProduct().getDiscount())
                .publisher(wish.getProduct().getPublisher())
                .createdAt(wish.getCreatedAt())
                .build();
    }
}
