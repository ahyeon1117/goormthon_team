package io.goorm.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
