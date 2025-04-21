package io.goorm.backend.init;

import io.goorm.backend.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import io.goorm.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserInit {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 개발용 초기 사용자 2명 생성
     *
     * username: 김구름
     * email: test@gmail.com
     * password: test1234!
     * 
     * username: 노구름
     * email: goorm@gmail.com
     * password: test1234!
     */
    @PostConstruct
    public void init() {

        // 사용자가 존재하지 않는다면 (초기화 중복 방지)
        if (userRepository.count() == 0) {
            // 초기 사용자 생성
            User user1 = User.builder()
                    .username("정구름")
                    .email("test@gmail.com")
                    .password(passwordEncoder.encode("test1234!"))
                    .build();
            
            User user2 = User.builder()
                    .username("노구름")
                    .email("goorm@gmail.com")
                    .password(passwordEncoder.encode("test1234!"))
                    .build();

            // 사용자 저장
            userRepository.save(user1);
            userRepository.save(user2);

            log.info("[USER_INIT] 개발용 초기 사용자 2명 생성 완료 - 이메일: {}, {}", user1.getEmail(), user2.getEmail());
        }
    }
}

