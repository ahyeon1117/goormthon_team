package io.goorm.backend.security;

import io.goorm.backend.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * 스프링 시큐리티의 UserDetails 인터페이스를 구현하여 인증된 사용자의 정보를 담는 클래스
 * - 현재 프로젝트에서는 이메일을 로그인 아이디로 사용한다.
 * - 현재 프로젝트에서는 권한 컬럼이 없으므로 기본 ROLE_USER를 부여한다.
 */
@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한 컬럼이 없으므로 기본 ROLE_USER 부여
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // 로그인할 때 비밀번호 비교용으로 사용
    @Override
    public String getPassword() {
        return user.getPassword(); // 암호화된 비밀번호 반환
    }

    // 로그인할 때 아이디 비교용으로 사용
    @Override
    public String getUsername() { // username: 로그인 시 사용자가 입력하는 로그인 ID를 의미 (우리 프로젝트에서는 이메일)
        return user.getEmail();
    }

    // 계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠금 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 비밀번호 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 활성화 여부
    @Override
    public boolean isEnabled() {
        return true;
    }

    /**
     * 사용자 정보를 담은 CustomUserDetails 객체 생성
     * @param user 사용자 엔티티
     * @return CustomUserDetails 객체
     */
    public static CustomUserDetails of(User user) {
        return new CustomUserDetails(user);
    }
}
