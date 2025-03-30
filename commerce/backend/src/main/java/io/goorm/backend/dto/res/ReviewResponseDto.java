package io.goorm.backend.dto.res;

import io.goorm.backend.entity.Review;
import lombok.Getter;

@Getter
public class ReviewResponseDto {
    private final Long id;
    private final String userId;
    private final Long productId;
    private final String title;
    private final String message;
    private final String createdAt;
    private final String updatedAt;

    public ReviewResponseDto(Review review) {
        this.id = review.getId();
        this.userId = review.getUser().getId();
        this.productId = review.getProduct().getId();
        this.title = review.getTitle();
        this.message = review.getMessage();
        this.createdAt = review.getCreatedAt() != null ? review.getCreatedAt().toString() : null;
        this.updatedAt = review.getUpdatedAt() != null ? review.getUpdatedAt().toString() : null;
    }
}
