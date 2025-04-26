package io.goorm.backend.global.exception;

public class DuplicateProjectMemberException extends RuntimeException {
    public DuplicateProjectMemberException(String message) {
        super(message);
    }
}
