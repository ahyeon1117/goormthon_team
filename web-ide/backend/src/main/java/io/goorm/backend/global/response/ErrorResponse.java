package io.goorm.backend.global.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 공통 에러 응답 포맷
 */
@Getter
@Builder
public class ErrorResponse {
    private final int status; // HTTP 상태 코드
    private final String message; // 사용자에게 보여줄 메시지
    private final String code; // 에러 코드 (예: USER_NOT_FOUND)
    private final String path; // 요청 경로

    // 에러 응답 생성 메서드
    public static ErrorResponse of(int status, String message, String code, String path) {
        return ErrorResponse.builder()
                .status(status)
                .message(message)
                .code(code)
                .path(path)
                .build();
    }
}