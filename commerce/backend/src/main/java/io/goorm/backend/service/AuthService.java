package io.goorm.backend.service;

import io.goorm.backend.dto.res.UserResponseDto;
import io.goorm.backend.dto.security.JwtUserInfoDto;
import io.goorm.backend.dto.security.SignUpServiceDto;
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
    private final CartService cartService;

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
    public UserResponseDto signUp(SignUpServiceDto dto) {
        String encryptedPassword = passwordEncoder.encode(dto.getPassword());

        // Entity 생성 및 저장
        User savedUser = userRepository.save(dto.toEntity(encryptedPassword));

        // 유저 생성 후 인벤토리 함께 생성
        inventoryService.createInventoryForUser(savedUser);
        // 유저 생성 후 장바구니 함께 생성
        cartService.createCartForUser(savedUser);

        // Entity -> DTO 변환 후 반환
        return UserResponseDto.fromEntity(savedUser);
    }
}
