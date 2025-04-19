package io.goorm.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * JWT 토큰에 저장할 사용자 인증 정보 DTO
 * 보안을 위해 최소한의 정보만 저장한다. (사용자 식별자)
 */
@Getter
@AllArgsConstructor
public class JwtUserInfoDto {

    private Long id; // 사용자 식별자
}