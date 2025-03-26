package io.goorm.backend.dto.security;

//import com.fasterxml.jackson.databind.PropertyNamingStrategies;
//import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
//@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class SignUpDto {

    private String userId;
    private String password;
    private String nickname;

    public UserInfo toService() {
        return UserInfo.builder()
            .userId(userId)
            .password(password)
            .nickname(nickname)
            .role("USER")
            .build();
    }
}
