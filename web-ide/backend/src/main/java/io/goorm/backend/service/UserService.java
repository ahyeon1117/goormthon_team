package io.goorm.backend.service;

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
 * 사용자 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;

    /**
     * 로그인 요청이 들어왔을 때, 스프링 시큐리티가 DB에서 사용자를 조회하여 인증할 수 있는 형태(UserDetails)로 반환해주는 메서드
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username) // 이메일로 사용자 조회 (username은 로그인 시 입력한 값을 의미)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 사용자가 없습니다."));

        return CustomUserDetails.of(user);
    }

    //JWT에서 받아온 id로 User 조회
    public User findById(String id) {
        Long userId = Long.parseLong(id);
        return userRepository.findById(userId) //id로 사용자 조회
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
