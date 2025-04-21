package io.goorm.backend.service;

import io.goorm.backend.dto.user.UserProfileResponse;
import io.goorm.backend.dto.user.UserUpdateRequest;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.exception.InvalidCurrentPasswordException;
import io.goorm.backend.global.exception.PasswordNotMatchedException;
import io.goorm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 관련 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    //JWT에서 받아온 id로 User 조회
    public User findById(Long id) {
        return userRepository.findById(id) //id로 사용자 조회
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    //사용자 생성
    public User createUser(String username, String email, String password) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(password)
                .build();
        return userRepository.save(user);
    }

    // 사용자 정보 조회
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = findById(userId);
        return UserProfileResponse.from(user);
    }
}   