package io.goorm.backend.dto.security;

import io.goorm.backend.entity.Authority;
import io.goorm.backend.entity.User;
import java.io.Serial;
import java.io.Serializable;
import lombok.*;

@Data
@AllArgsConstructor
@Builder
public class UserInfo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L; // 권장되는 직렬화 버전 UID

    private final String userId;
    private String password;
    private final String nickname;
    private final String role;

    public void encryptPassword(String encryptedPassword) {
        this.password = encryptedPassword;
    }

    public User toEntity(String encodedPassword) {
        return User.builder()
            .id(userId)
            .password(encodedPassword)
            .nickname(nickname)
            .role(Authority.valueOf(role.toUpperCase()))
            .build();
    }
}
