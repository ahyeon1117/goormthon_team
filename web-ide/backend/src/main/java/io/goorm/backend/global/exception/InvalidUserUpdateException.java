package io.goorm.backend.global.exception;

public class InvalidUserUpdateException extends RuntimeException {
    public InvalidUserUpdateException(String message) {
        super(message);
    }
}
