package io.goorm.backend.global.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.dto.auth.JwtUserInfoDto;
import io.goorm.backend.dto.auth.LoginRequest;
import io.goorm.backend.global.response.ApiResponse;
import io.goorm.backend.global.response.ErrorResponse;
import io.goorm.backend.security.CustomUserDetails;
import io.goorm.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

/**
 * 로그인 인증을 처리하는 필터
 * 사용자의 이메일/비밀번호를 검증하고 인증 성공 시 JWT 토큰을 발급한다.
 */
@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final JwtService jwtService; // JWT 서비스 (토큰 생성, 검증)
    private final boolean postOnly = true; // 로그인은 POST 요청만 허용

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
        setFilterProcessesUrl("/api/v1/auth/login"); // 기본 로그인 경로 /login에서 변경
    }

    // 1. 로그인 인증 시도 (클라이언트가 로그인 요청을 보낼 때 호출된다.)
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        // 1-1. POST 요청만 허용
        if (postOnly && !request.getMethod().equals("POST")) {
            log.warn("[LOGIN_FAILED] 지원하지 않는 요청 메서드: {}", request.getMethod());
            
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        } else {
            try {
                // 1-2. 요청 데이터 파싱 (JSON 형식의 요청 데이터 -> LoginRequest 객체로 변환)
                LoginRequest requestDto = new ObjectMapper().readValue(request.getInputStream(), LoginRequest.class);
                String email = requestDto.getEmail();
                String password = requestDto.getPassword();

                // 1-3. 인증 매니저에게 인증 요청
                return getAuthenticationManager()
                        .authenticate(new UsernamePasswordAuthenticationToken(email, password));

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    // 2. 로그인 성공 시 호출
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {
        
        // Authentication 객체에서 사용자 정보 추출
        CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();

        // 식별자(PK) 가져오기
        Long userId = userDetails.getUser().getId();

        // JWT 토큰 생성 (식별자만 포함)
        String token = jwtService.createToken(new JwtUserInfoDto(userId));
        
        log.info("[LOGIN_SUCCESS] 로그인 성공 - userId: {}, email: {}", userId, userDetails.getUsername());
        log.debug("[TOKEN_CREATED] 토큰 발급 완료");

        // 응답 메시지 생성
        ApiResponse<String> responseMessage = ApiResponse.success(token);
        String responseJSON = new ObjectMapper().writeValueAsString(responseMessage);

        // 응답 설정
        response.setContentType("application/json; charset=UTF-8"); // JSON 타입 + UTF-8 설정
        response.setCharacterEncoding("UTF-8"); // 한글 인코딩 설정 추가
        response.getWriter().write(responseJSON);
    }

    // 3. 로그인 실패 시 호출
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException {
        
        log.warn("[LOGIN_FAILED] 로그인 실패");
        
        // 응답 객체 생성
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "아이디 또는 비밀번호가 올바르지 않습니다.", // 보안을 위해 구체적 메시지(가입되지 않은 이메일 / 로그인 실패) 노출 금지
                "AUTHENTICATION_FAILED",
                "/api/v1/auth/login");
        
        // 응답 객체를 JSON 형식으로 변환
        String responseJSON = new ObjectMapper().writeValueAsString(errorResponse);
        response.setContentType("application/json; charset=UTF-8"); // JSON 타입 + UTF-8 설정
        response.setCharacterEncoding("UTF-8"); // 한글 인코딩 설정 추가
        response.getWriter().write(responseJSON);
    }
}