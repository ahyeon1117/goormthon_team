package io.goorm.backend.dto.security;

import io.goorm.backend.entity.Authority;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtUserInfoDto {

  private String userId;
  private Authority role;
}
