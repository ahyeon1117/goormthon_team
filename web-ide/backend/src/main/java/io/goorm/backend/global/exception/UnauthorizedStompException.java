package io.goorm.backend.global.exception;

public class UnauthorizedStompException extends RuntimeException {
    public UnauthorizedStompException(String message) {
        super(message);
    }
}
