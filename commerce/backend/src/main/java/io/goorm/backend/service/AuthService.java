package io.goorm.backend.service;

import io.goorm.backend.dto.security.JwtUserInfoDto;
import io.goorm.backend.dto.security.UserInfo;
import io.goorm.backend.entity.User;
import io.goorm.backend.repository.UserRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final InventoryService inventoryService;

    @Transactional
    public String signIn(String userId, String password) {
        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new NoSuchElementException("등록되지 않은 사용자 입니다.")
            );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        JwtUserInfoDto info = new JwtUserInfoDto(user.getId(), user.getRole());
        return jwtService.createToken(info);
    }

    @Transactional
    public User signUp(UserInfo userInfo) {
        String encryptedPassword = passwordEncoder.encode(
            userInfo.getPassword()
        );
        User savedUser = userRepository.save(userInfo.toEntity(encryptedPassword));

        // 유저 생성 후 인벤토리도 함께 생성
        inventoryService.createInventoryForUser(savedUser);

        return savedUser;
    }
}
