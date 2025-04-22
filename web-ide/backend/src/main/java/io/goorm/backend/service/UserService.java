package io.goorm.backend.service;

import io.goorm.backend.dto.user.UserProfileResponse;
import io.goorm.backend.dto.user.UserUpdateRequest;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.exception.InvalidCurrentPasswordException;
import io.goorm.backend.global.exception.PasswordNotMatchedException;
import io.goorm.backend.global.exception.SameAsCurrentPasswordException;
import io.goorm.backend.global.exception.UserNotFoundException;
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

    // 이메일로 사용자 조회
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException());
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

    // 사용자 정보 수정
    @Transactional
    public UserProfileResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        // 사용자 조회
        User user = findById(userId);

        // 1. 이름 변경
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.updateUsername(request.getUsername()); // setter 최소화 권장
        }

        // 2. 비밀번호 변경
        // 세 input 모두 입력되어야 변경 가능
        boolean changePasswordRequested =
            request.getCurrentPassword() != null && !request.getCurrentPassword().isBlank() &&
            request.getNewPassword() != null && !request.getNewPassword().isBlank() &&
            request.getConfirmPassword() != null && !request.getConfirmPassword().isBlank();

        if (changePasswordRequested) {
            // 2-1. 현재 비밀번호 일치 여부 검증
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new InvalidCurrentPasswordException();
            }

            // 2-2. 새 비밀번호와 비밀번호 확인 일치 여부
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                throw new PasswordNotMatchedException();
            }

            // 2-3. 현재 비밀번호와 새 비밀번호가 동일한지 (동일하면 변경 불가)
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                throw new SameAsCurrentPasswordException();
            }

            // 비밀번호 변경
            String encryptedPassword = passwordEncoder.encode(request.getNewPassword());
            user.updatePassword(encryptedPassword);
        }

        log.info("[UPDATE_USER_PROFILE_SUCCESS] 회원 정보 수정 완료 - userId: {}", userId);

        return UserProfileResponse.from(user);
    }
}   