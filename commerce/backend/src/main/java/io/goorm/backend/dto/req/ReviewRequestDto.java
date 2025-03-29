package io.goorm.backend.dto.req;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDto {

    @NotNull(message = "사용자 ID는 필수입니다.") // 공백 허용 X
    private String userId;

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotBlank(message = "리뷰 제목은 필수입니다.") // title 추가
    private String title;

    @NotBlank(message = "리뷰 내용은 필수입니다.")
    private String message;
}
