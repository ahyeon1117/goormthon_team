package io.goorm.backend.exception;

public class KernelException extends RuntimeException {
    public KernelException(String message) {
        super(message);
    }

    public KernelException(String message, Throwable cause) {
        super(message, cause);
    }
}