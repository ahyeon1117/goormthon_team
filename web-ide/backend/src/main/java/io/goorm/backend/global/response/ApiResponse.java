package io.goorm.backend.global.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 공통 성공 응답 포맷
 */
@Getter
@Builder
public class ApiResponse<T> {
    private final int code; // HTTP 상태 코드
    private final String message; // 응답 메시지
    private final T data; // 응답 데이터

    // 단순 데이터 응답에 사용
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .message("success")
                .data(data)
                .build();
    }

    // 메시지를 추가하여 성공 응답 반환
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .build();
    }
}