package io.goorm.backend.service;

import io.goorm.backend.dto.res.UserInfoResponse;
import io.goorm.backend.dto.security.AuthenticationToken;
import io.goorm.backend.entity.User;
import io.goorm.backend.exception.NotFoundUserException;
import io.goorm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public User findById(String id) {
        return userRepository
            .findById(id)
            .orElseThrow(NotFoundUserException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username)
        throws UsernameNotFoundException {
        User user = userRepository
            .findById(username)
            .orElseThrow(() ->
                new UsernameNotFoundException("해당하는 유저는 없습니다.")
            );

        return AuthenticationToken.of(user);
    }

    /**
     * 현재 인증된 사용자의 정보를 DTO 형태로 조회합니다. (외부 API용)
     * @return 현재 인증된 사용자 정보 DTO
     */
    @Transactional(readOnly = true)
    public UserInfoResponse getUserInfo() {
        User user = getCurrentUser();
        return UserInfoResponse.of(user);
    }

    /**
     * 현재 인증된 사용자의 정보를 조회합니다. (내부 전용)
     * @return 현재 인증된 사용자 정보
     */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        String userId = jwtService.getUserId();
        if (userId == null) {
            throw new NotFoundUserException();
        }
        return findById(userId);
    }
}
