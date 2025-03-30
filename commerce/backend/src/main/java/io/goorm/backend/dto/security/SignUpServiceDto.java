package io.goorm.backend.dto.security;

import io.goorm.backend.entity.Authority;
import io.goorm.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpServiceDto {
    private String id;
    private String password;
    private String nickname;
    private Authority role;

    public User toEntity(String encryptedPassword) {
        return User.builder()
                .id(id)
                .password(encryptedPassword)
                .nickname(nickname)
                .role(role != null ? role : Authority.USER) // 기본값은 USER
                .build();
    }
} 
