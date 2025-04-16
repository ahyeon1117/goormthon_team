package io.goorm.backend.service;

import io.goorm.backend.dto.auth.JwtUserInfoDto;
import io.goorm.backend.dto.auth.LoginRequest;
import io.goorm.backend.dto.auth.SignUpServiceDto;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.exception.DuplicateEmailException;
import io.goorm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

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
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));
        
        // 비밀번호 검증
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        JwtUserInfoDto info = new JwtUserInfoDto(user.getId()); // 인증된 사용자 정보(식별자)를 담은 DTO 생성
        return jwtService.createToken(info); // 사용자 정보를 전달받아 JWT 토큰 생성
    }
}
