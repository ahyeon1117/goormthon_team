package io.goorm.backend.service;

import io.goorm.backend.entity.User;
import io.goorm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 사용자 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

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

}
