package io.goorm.backend.dto.res;

import io.goorm.backend.entity.Review;
import lombok.Getter;

@Getter
public class ReviewResponseDto {
    private final String userId;
    private final Long productId;
    private final String title;
    private final String message;

    public ReviewResponseDto(Review review) {
        this.userId = review.getUser().getId();
        this.productId = review.getProduct().getId();
        this.title = review.getTitle();
        this.message = review.getMessage();
    }
}