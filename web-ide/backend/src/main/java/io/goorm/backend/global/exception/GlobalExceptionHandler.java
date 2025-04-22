package io.goorm.backend.global.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.UnexpectedTypeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import io.goorm.backend.global.response.ErrorResponse;

/**
 * 전역 예외 처리 클래스
 * 모든 예외를 처리하고 예외 처리 결과를 반환한다.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // ========================================================
    // 1. 사용자 정의 예외 (Custom Exception)
    // ========================================================

    // [사용자 조회 실패 예외] - 사용자를 찾을 수 없는 경우
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundUserException(UserNotFoundException e, HttpServletRequest request) {
        log.warn("사용자를 찾을 수 없음: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.of(404, e.getMessage(), "USER_NOT_FOUND", request.getRequestURI()));
    }
    
    // [이메일 중복 예외] - 이메일이 이미 존재하는 경우
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmailException(DuplicateEmailException e, HttpServletRequest request) {
        log.warn("이메일 중복: {}", request.getRequestURI(), e);
    
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ErrorResponse.of(409, e.getMessage(), "DUPLICATE_EMAIL", request.getRequestURI()));
    }

    // [현재 비밀번호 불일치 예외] - 현재 비밀번호가 일치하지 않는 경우
    @ExceptionHandler(InvalidCurrentPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCurrentPasswordException(InvalidCurrentPasswordException e, HttpServletRequest request) {
        log.warn("현재 비밀번호 불일치: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, e.getMessage(), "INVALID_CURRENT_PASSWORD", request.getRequestURI()));
    }

    // [비밀번호 불일치 예외] - 새 비밀번호와 비밀번호 확인이 일치하지 않는 경우
    @ExceptionHandler(PasswordNotMatchedException.class)
    public ResponseEntity<ErrorResponse> handlePasswordNotMatchedException(PasswordNotMatchedException e, HttpServletRequest request) {
        log.warn("새 비밀번호와 비밀번호 확인 불일치: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, e.getMessage(), "PASSWORD_NOT_MATCHED", request.getRequestURI()));
    }
        

    // ========================================================
    // 2. 기본 예외 처리 (JWT, Validation, DB 등)
    // ======================================================== 

    // [DB 제약 예외] - UNIQUE, NOT NULL, FOREIGN KEY 제약 위반 시 발생
    @ExceptionHandler({SQLIntegrityConstraintViolationException.class})
    public ResponseEntity<ErrorResponse> handlerSQLException(Exception e, HttpServletRequest request) throws IOException {
        log.error("DB 제약 조건 위반 발생: {}", request.getRequestURI(), e);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of(409, "데이터 무결성 제약 조건 위반", "DATA_INTEGRITY_VIOLATION", request.getRequestURI()));
    }

    // [기타 일반 예외] - Optional.get() 실패, 파일 입출력 문제, 잘못된 검증 타입 설정 등
    @ExceptionHandler({NoSuchElementException.class, IOException.class, UnexpectedTypeException.class})
    public ResponseEntity<ErrorResponse> handlerAllException(Exception e, HttpServletRequest request) throws IOException {
        log.warn("일반 예외 발생: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(500, e.getMessage(), "UNHANDLED_EXCEPTION", request.getRequestURI()));
    }

    // [JWT 인증 예외] - 서명이 유효하지 않은 토큰 (위조된 토큰)
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ErrorResponse> handleSignatureException(SignatureException e, HttpServletRequest request) {
        log.warn("JWT 서명 검증 실패: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, "유효하지 않은 JWT 서명입니다.", "INVALID_JWT_SIGNATURE", request.getRequestURI()));
    }

    // [JWT 인증 예외] - JWT 형식이 잘못된 경우 (파싱 불가)
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ErrorResponse> handleMalformedJwtException(MalformedJwtException e, HttpServletRequest request) {
        log.warn("잘못된 JWT 형식: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, "잘못된 JWT 형식입니다.", "MALFORMED_JWT", request.getRequestURI()));
    }

    // [JWT 인증 예외] - 토큰 유효 기간이 만료된 경우
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException e, HttpServletRequest request) {
        log.warn("JWT 토큰 만료: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, "JWT 토큰이 만료되었습니다.", "EXPIRED_JWT", request.getRequestURI()));
    }

    // [Validation 실패 예외] - 요청 DTO의 유효성 검사가 실패한 경우 (Spring 6+)
    @Override
    @Order(1)
    protected ResponseEntity<Object> handleHandlerMethodValidationException(HandlerMethodValidationException ex,
                                                                            HttpHeaders headers,
                                                                            HttpStatusCode status,
                                                                            WebRequest request) {
        try {
            log.warn("Validation 실패: {}", ((HttpServletRequest) request).getRequestURI(), ex);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorResponse.of(400, "요청 값이 올바르지 않습니다.", makeRequestMessage(request), ((HttpServletRequest) request).getRequestURI()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String makeRequestMessage(WebRequest request) throws IOException {
        return ((HttpServletRequest) request).getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    }

    // ========================================================
    // 3. 처리되지 않은 예외 (Fallback)
    // ======================================================== 

    // [처리되지 않은, 기타 모든 예외] - 마지막 순위로 실행됨
    @ExceptionHandler(Exception.class)
    @Order(Integer.MAX_VALUE) // 가장 낮은 우선순위로 설정
    public ResponseEntity<ErrorResponse> handleUnhandledException(Exception e, HttpServletRequest request) {
        log.error("처리되지 않은 예외 발생: {}", request.getRequestURI(), e);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(500, "서버에서 오류가 발생했습니다.", "INTERNAL_SERVER_ERROR", request.getRequestURI()));
    }
}