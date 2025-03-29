package io.goorm.backend.controller;

import io.goorm.backend.dto.res.ApiResponse;
import io.goorm.backend.dto.req.ReviewRequestDto;
import io.goorm.backend.dto.res.ProductResponse;
import io.goorm.backend.dto.res.ReviewResponseDto;
import io.goorm.backend.entity.User;
import io.goorm.backend.service.ReviewService;
import io.goorm.backend.service.UserService;
import io.goorm.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor

public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    // 리뷰 생성 API
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponseDto>> createReview(@RequestBody ReviewRequestDto requestDto) {
        ReviewResponseDto responseDto = reviewService.createReview(requestDto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }

    // 특정 사용자의 리뷰 조회 API
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDto>>> getReviewsByCurrentUser(@PathVariable String userId) {
        User user = userService.getCurrentUser();
        List<ReviewResponseDto> reviews = reviewService.getReviewsByUser(user)
            .stream().map(ReviewResponseDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    // 특정 상품의 리뷰 조회 API
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDto>>> getReviewsByProduct(@PathVariable Long productId) {
        // 상품 정보 조회 (외부 API용 메서드 사용)
        ProductResponse product = productService.getProductById(productId);
        // 서비스에서 이미 DTO로 변환된 결과를 바로 사용
        List<ReviewResponseDto> reviews = reviewService.getReviewsByProductResponse(product);
        // 리뷰 리스트 반환
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

}
