package io.goorm.backend.service;

import io.goorm.backend.dto.auth.SignUpServiceDto;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * 회원가입 비즈니스 로직
     * @param signUpServiceDto 회원가입 요청 DTO
     * @return UserResponse 회원가입 응답 DTO
     */
    @Transactional
    public User signUp(SignUpServiceDto signUpServiceDto) {

        // 이메일 중복 체크
        if (userRepository.existsByEmail(signUpServiceDto.getEmail())) {
            throw new RuntimeException("이미 가입된 이메일입니다.");
        }

        // 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(signUpServiceDto.getPassword());

        // 사용자 엔티티 생성 및 저장
        return userRepository.save(signUpServiceDto.toEntity(encryptedPassword));
    }
}
