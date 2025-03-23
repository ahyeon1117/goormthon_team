package io.goorm.backend.init;

import io.goorm.backend.entity.Authority;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserInit {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // 이미 사용자가 존재하는지 확인
        if (userRepository.count() == 0) {
            // 샘플 사용자 생성
            User sampleUser = User.builder()
                    .id("goorm")
                    .password(passwordEncoder.encode("qwer1234"))
                    .nickname("구르미")
                    .role(Authority.USER)
                    .build();

            // 사용자 저장
            userRepository.save(sampleUser);
        }
    }
}
