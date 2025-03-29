package io.goorm.backend.controller;

import io.goorm.backend.dto.req.ReviewRequestDto;
import io.goorm.backend.dto.res.ProductResponse;
import io.goorm.backend.dto.res.ReviewResponseDto;
import io.goorm.backend.entity.Review;
import io.goorm.backend.entity.User;
import io.goorm.backend.entity.Product;
import io.goorm.backend.service.ReviewService;
import io.goorm.backend.service.UserService;
import io.goorm.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor

public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    // 리뷰 생성 API
    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(@RequestBody ReviewRequestDto requestDto) {
        ReviewResponseDto responseDto = reviewService.createReview(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 특정 사용자의 리뷰 조회 API
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByCurrentUser(@PathVariable String userId) {
        User user = userService.getCurrentUser();
        List<ReviewResponseDto> reviews = reviewService.getReviewsByUser(user)
            .stream().map(ReviewResponseDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    // 특정 상품의 리뷰 조회 API
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByProduct(@PathVariable Long productId) {
        // 상품 정보 조회
        ProductResponse product = productService.getProductById(productId);

        // Product 객체를 사용해 리뷰 조회
        List<ReviewResponseDto> reviews = reviewService.getReviewsByProduct(product)
            .stream()
            .map(ReviewResponseDto::new)
            .collect(Collectors.toList());

        // 리뷰 리스트 반환
        return ResponseEntity.ok(reviews);
    }

}
