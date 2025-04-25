package io.goorm.backend.service;

import io.goorm.backend.dto.user.UserProfileResponse;
import io.goorm.backend.dto.user.UserUpdateRequest;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.exception.*;
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

    // 사용자 정보 수정 (이름, 비밀번호 중 선택적으로 변경 가능)
    @Transactional
    public UserProfileResponse updateUserProfile(Long userId, UserUpdateRequest request) {

        // 사용자 조회
        User user = findById(userId);

        // 입력 필드 정보
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        String currentPassword = request.getCurrentPassword() != null ? request.getCurrentPassword().trim() : "";
        String newPassword = request.getNewPassword() != null ? request.getNewPassword().trim() : "";
        String confirmPassword = request.getConfirmPassword() != null ? request.getConfirmPassword().trim() : "";

        // [변경 요청 여부]
        // 이름 변경 여부
        boolean changeUsernameRequested = !username.isEmpty();
        // 비밀번호 변경 여부 (세 input 모두 입력되어야 변경 가능)
        boolean changePasswordRequested =
            !currentPassword.isEmpty() &&
            !newPassword.isEmpty() &&
            !confirmPassword.isEmpty();
        // 비밀번호 필드가 일부만 입력된 경우
        boolean somePasswordsMissing =
            (!currentPassword.isEmpty() || !newPassword.isEmpty() || !confirmPassword.isEmpty())
            && !changePasswordRequested;

        // [변경 불가능한 경우]
        // 비밀번호 필드가 일부만 입력된 경우
        if (somePasswordsMissing) {
            throw new InvalidUserUpdateException("비밀번호 변경을 위해 세 필드를 모두 입력해주세요.");
        }
        // 이름과 비밀번호가 모두 비어있으면 변경 불가
        if (!changeUsernameRequested && !changePasswordRequested) {
            throw new InvalidUserUpdateException("변경할 정보가 없습니다. 이름 또는 비밀번호를 입력해주세요.");
        }
        
        // 1. 이름 변경 처리
        if (changeUsernameRequested) {
            user.updateUsername(username); // setter 최소화 권장
        }

        // 2. 비밀번호 변경 처리
        if (changePasswordRequested) {
            // 2-1. 현재 비밀번호 일치 여부 검증
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new InvalidUserUpdateException("현재 비밀번호가 일치하지 않습니다.");
            }

            // 2-2. 새 비밀번호와 비밀번호 확인 일치 여부
            if (!newPassword.equals(confirmPassword)) {
                throw new InvalidUserUpdateException("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            }

            // 2-3. 현재 비밀번호와 새 비밀번호가 동일한지 (동일하면 변경 불가)
            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                throw new InvalidUserUpdateException("현재 비밀번호와 새 비밀번호가 동일합니다.");
            }

            // 비밀번호 변경
            String encryptedPassword = passwordEncoder.encode(newPassword);
            user.updatePassword(encryptedPassword);
        }

        log.info("[UPDATE_USER_PROFILE_SUCCESS] 회원 정보 수정 완료 - userId: {}", userId);

        return UserProfileResponse.from(user);
    }
}