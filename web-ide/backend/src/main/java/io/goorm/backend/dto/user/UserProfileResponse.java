package io.goorm.backend.dto.user;

import io.goorm.backend.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;

    // User 엔티티를 UserProfileResponse 응답 DTO로 변환
    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .build();
    }

}
