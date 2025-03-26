package io.goorm.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
@AllArgsConstructor
public enum Authority implements GrantedAuthority {
    ADMIN(99),
    USER(1),
    GUEST(0);

    private final int grade;

    @Override
    public String getAuthority() {
        return this.name();
    }

    public static Authority valueOf(int grade) {
        return switch (grade) {
            case 1 -> USER;
            case 99 -> ADMIN;
            default -> GUEST;
        };
    }
}
