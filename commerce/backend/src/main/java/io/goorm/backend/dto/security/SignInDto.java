package io.goorm.backend.dto.security;

//import com.fasterxml.jackson.databind.PropertyNamingStrategies;
//import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
//@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class SignInDto {

  private String userId;
  private String password;
}
