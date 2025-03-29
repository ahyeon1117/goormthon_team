package io.goorm.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(name = "nick_name", nullable = false, length = 100)
    private String nickname;

    //닉네임 변경
    public void setNickname(String newNickname) {
        if (newNickname == null || newNickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 빈 값이 될 수 없습니다.");
        }
        this.nickname = newNickname;
    }

    @Column(nullable = false)
    private Authority role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public User(String id, String password, String nickname, Authority role) {
        this.id = id;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
    }
}
