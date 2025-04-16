package io.goorm.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 로그인 요청 DTO
 * 이메일과 비밀번호를 입력받는다.
 */
@Getter
@NoArgsConstructor // HTTP 요청의 JSON을 객체로 변환하기 위한 기본 생성자
public class LoginRequest {

    @NotBlank(message = "이메일은 필수 입력 사항입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 사항입니다.")
    private String password;
}