package io.goorm.backend.service;

import io.goorm.backend.dto.req.ReviewRequestDto;
import io.goorm.backend.dto.res.ReviewResponseDto;
import io.goorm.backend.dto.res.ProductResponse;
import io.goorm.backend.entity.Product;
import io.goorm.backend.entity.Review;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.ReviewRepository;
import io.goorm.backend.repository.ProductRepository;
import io.goorm.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    // 내부 서비스용 - 특정 상품(엔티티)에 대한 리뷰 엔티티 목록 조회
    public List<Review> getReviewsByProduct(Product product) {
        return reviewRepository.findByProduct(product);
    }

    // 외부 API용 - 상품 응답(DTO)에 대한 리뷰 DTO 목록 조회 및 변환
    public List<ReviewResponseDto> getReviewsByProductResponse(ProductResponse productResponse) {
        // ProductResponse의 ID로 실제 Product 엔티티 조회
        Product product = productRepository.findById(productResponse.getId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        // 해당 상품의 리뷰 엔티티 목록 조회
        List<Review> reviews = getReviewsByProduct(product);
        // 엔티티를 DTO로 변환
        List<ReviewResponseDto> reviewResponseDtos = reviews.stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
        // DTO 목록 반환
        return reviewResponseDtos;
    }

    // 리뷰 저장 (중복 가능하도록 변경)
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

}
