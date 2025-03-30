package io.goorm.backend.dto.res;

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
public class UserResponseDto {
    private String id;
    private String nickname;
    private Authority role;
    // 민감한 정보인 password는 제외

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .role(user.getRole())
                .build();
    }
} 
