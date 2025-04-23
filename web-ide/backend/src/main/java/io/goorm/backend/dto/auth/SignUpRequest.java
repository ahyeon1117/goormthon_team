package io.goorm.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청 DTO
 * 이름, 이메일, 비밀번호를 입력받는다.
 */
@Getter
@NoArgsConstructor // HTTP 요청의 JSON을 객체로 변환하기 위한 기본 생성자
public class SignUpRequest {

    @NotBlank(message = "이름은 필수 입력 사항입니다.")
    @Size(max = 50, message = "이름은 최대 50자까지 입력 가능합니다.")
    private String username;

    @NotBlank(message = "이메일은 필수 입력 사항입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Size(max = 100, message = "이메일은 최대 100자까지 입력 가능합니다.")
    private String email;

    /**
     * 사용자 비밀번호
     * 영문자와 숫자를 필수로 포함하여 8자 이상이어야 한다. (특수문자는 선택사항)
     */
    @NotBlank(message = "비밀번호는 필수 입력 사항입니다.")
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()\\-_=+\\[\\]{};:'\",.<>/?]{8,}$",
        message = "비밀번호는 영문자와 숫자를 필수로 포함하여 8자 이상이어야 합니다. (특수문자 사용 가능)"
    )
    private String password;

    /**
     * 요청 DTO를 서비스용 DTO로 변환한다.
     * @return SignUpServiceDto 변환 객체
     */
    public SignUpServiceDto toServiceDto() {
        return SignUpServiceDto.builder()
            .username(username)
            .email(email)
            .password(password)
            .build();
    }
}