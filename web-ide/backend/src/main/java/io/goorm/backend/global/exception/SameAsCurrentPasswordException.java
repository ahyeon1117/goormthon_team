package io.goorm.backend.global.exception;

public class SameAsCurrentPasswordException extends RuntimeException {
    public SameAsCurrentPasswordException() {
        super("새 비밀번호가 현재 비밀번호와 동일합니다.");
    }
}
