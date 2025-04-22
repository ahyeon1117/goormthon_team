package io.goorm.backend.dto.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateRequest {

    @Size(max = 50, message = "이름은 최대 50자까지 입력 가능합니다.")
    private String username;

    private String currentPassword; // 현재 비밀번호

    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()\\-_=+\\[\\]{};:'\",.<>/?]{8,}$",
        message = "비밀번호는 영문자와 숫자를 필수로 포함하여 8자 이상이어야 합니다. (특수문자 사용 가능)"
    )
    private String newPassword; // 새 비밀번호

    private String confirmPassword; // 새 비밀번호 확인
}