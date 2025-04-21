package io.goorm.backend.dto.auth;

import io.goorm.backend.entity.User;
import lombok.Builder;
import lombok.Getter;

/**
 * 회원가입 서비스용 DTO
 * 서비스 레이어에서 회원가입 비즈니스 로직에 사용한다.
 */
@Getter
@Builder
public class SignUpServiceDto {
    private String username;
    private String email;
    private String password;

    /**
     * 암호화된 비밀번호를 포함하여 User 엔티티로 변환한다.
     * @param encryptedPassword 암호화된 비밀번호
     * @return User (User 엔티티)
     */
    public User toEntity(String encryptedPassword) {
        return User.builder()
            .username(username)
            .email(email)
            .password(encryptedPassword)
            .build();
    }
}