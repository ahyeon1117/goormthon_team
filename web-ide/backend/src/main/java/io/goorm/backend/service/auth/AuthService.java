package io.goorm.backend.service.auth;

import io.goorm.backend.dto.auth.JwtUserInfoDto;
import io.goorm.backend.dto.auth.LoginRequest;
import io.goorm.backend.dto.auth.SignUpServiceDto;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.exception.DuplicateEmailException;
import io.goorm.backend.global.exception.InvalidCurrentPasswordException;
import io.goorm.backend.global.exception.UserNotFoundException;
import io.goorm.backend.repository.UserRepository;
import io.goorm.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * 인증 관련 서비스
 * 회원가입, 로그인 비즈니스 로직을 처리한다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RedisService redisService;
    
    /**
     * 회원가입 비즈니스 로직
     * @param signUpServiceDto 회원가입 요청 DTO
     * @return User엔티티
     */
    @Transactional
    public User signUp(SignUpServiceDto signUpServiceDto) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(signUpServiceDto.getEmail())) {
            throw new DuplicateEmailException();
        }

        // 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(signUpServiceDto.getPassword());

        // 사용자 엔티티 생성 및 저장
        User user = userRepository.save(signUpServiceDto.toEntity(encryptedPassword));

        log.info("[SIGNUP_SUCCESS] 회원 가입 완료 - email: {}, userId: {}", user.getEmail(), user.getId());

        return user;
    }

    /**
     * 로그인 비즈니스 로직
     * @param loginRequest 로그인 요청 DTO
     * @return JWT 토큰
     */
    @Transactional(readOnly = true)
    public String login(LoginRequest loginRequest) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UserNotFoundException());
        
        // 비밀번호 검증
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException();
        }

        // JWT 토큰 생성
        JwtUserInfoDto info = new JwtUserInfoDto(user.getId()); // 인증된 사용자 정보(식별자)를 담은 DTO 생성
        return jwtService.createToken(info); // 사용자 정보를 전달받아 JWT 토큰 생성
    }

    /**
     * 로그아웃 비즈니스 로직
     * @param accessToken
     */
    @Transactional
    public void logout(String accessToken) {
        // 기존 Refresh Token 제거
        redisService.delete(accessToken);

        // Access Token의 남은 TTL 계산 (TTL: Time To Live, 남은 유효시간)
        Date expiration = jwtService.getExpiredTime(accessToken); // 만료 시간
        long ttl = expiration.getTime() - System.currentTimeMillis(); // 남은 유효시간 계산

        // Access Token이 만료되지 않았다면 블랙리스트에 등록
        if(ttl > 0) {
            redisService.addToBlacklist(accessToken, ttl);
        }

        log.info("[LOGOUT_SUCCESS] 로그아웃 완료 - blacklisted accessToken: {}", accessToken);
    }
}
