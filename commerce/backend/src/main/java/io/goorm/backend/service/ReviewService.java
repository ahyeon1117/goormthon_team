package io.goorm.backend.service;

import io.goorm.backend.dto.req.ReviewRequestDto;
import io.goorm.backend.dto.res.ProductResponse;
import io.goorm.backend.dto.res.ReviewResponseDto;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.Review;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.ReviewRepository;
import io.goorm.backend.repository.ProductRepository;
import io.goorm.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // 리뷰 생성
    public ReviewResponseDto createReview(ReviewRequestDto reviewRequestDto) {
        User user = userRepository.findById(reviewRequestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(reviewRequestDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review(user, product,null, reviewRequestDto.getTitle(), reviewRequestDto.getMessage());
        reviewRepository.save(review);

        return new ReviewResponseDto(review);  // 응답을 DTO로 변환해서 반환
    }



    // 특정 사용자의 리뷰 조회
    public List<Review> getReviewsByUser(User user) {
        return reviewRepository.findByUser(user);
    }

    // 특정 상품의 리뷰 조회
    public List<Review> getReviewsByProduct(ProductResponse product) {
        return reviewRepository.findByProduct(product);
    }

    // 리뷰 저장 (중복 가능하도록 변경)
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

}
