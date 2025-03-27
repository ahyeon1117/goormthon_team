package io.goorm.backend.dto.res;

import io.goorm.backend.entity.Authority;
import io.goorm.backend.entity.User;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserInfoResponse {
    private String userId;
    private String nickname;
    private Authority role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public UserInfoResponse(String userId, String nickname, Authority role,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserInfoResponse of(User user) {
        return UserInfoResponse.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
