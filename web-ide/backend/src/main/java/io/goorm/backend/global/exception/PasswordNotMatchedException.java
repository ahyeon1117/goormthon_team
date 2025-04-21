package io.goorm.backend.global.exception;

public class PasswordNotMatchedException extends RuntimeException {
    public PasswordNotMatchedException() {
        super("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }   
}