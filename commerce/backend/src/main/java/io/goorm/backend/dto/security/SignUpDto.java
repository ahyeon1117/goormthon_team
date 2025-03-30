package io.goorm.backend.dto.security;

//import com.fasterxml.jackson.databind.PropertyNamingStrategies;
//import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.goorm.backend.entity.Authority;
import lombok.Data;

@Data
//@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class SignUpDto {

    private String userId;
    private String password;
    private String nickname;

    public SignUpServiceDto toService() {
        return SignUpServiceDto.builder()
            .id(userId)
            .password(password)
            .nickname(nickname)
            .role(Authority.USER)
            .build();
    }
}
