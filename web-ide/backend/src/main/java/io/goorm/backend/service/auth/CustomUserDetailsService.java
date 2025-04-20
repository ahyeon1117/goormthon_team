package io.goorm.backend.service.auth;

import io.goorm.backend.entity.User;
import io.goorm.backend.repository.UserRepository;
import io.goorm.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증(Authentication) 관련 사용자 정보 조회 서비스
 * 
 * 
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // 로그인 시 이메일(email) 기반 사용자 조회 - UserDetailsService 인터페이스 구현 시 필수 메서드
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 사용자가 없습니다."));
        return CustomUserDetails.of(user);
    }

    // JWT 토큰 인증 시 사용자 PK(userId) 기반 사용자 조회
    @Transactional(readOnly = true)
    public UserDetails loadUserByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 사용자가 없습니다."));
        return CustomUserDetails.of(user);
    }
}
