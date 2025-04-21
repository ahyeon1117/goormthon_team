package io.goorm.backend.global.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.goorm.backend.global.response.ErrorResponse;
import io.goorm.backend.service.auth.CustomUserDetailsService;
import io.goorm.backend.service.JwtService;
import io.goorm.backend.service.auth.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 토큰 검증 필터
 * 로그인 이후의 요청에서 Authorization 헤더에 있는 JWT 토큰을 검증해서 사용자 인증을 시켜주는 필터
 */
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;
    private final OrRequestMatcher publicUrlMatcher; // 인증이 필요 없는 경로
    private final RedisService redisService; // Redis 서비스 (Redis에 refresh token 저장/조회 용도)
    // 매 요청마다 호출되는 필터
    // 요청에 JWT가 있으면 유효한지 검사하고, 인증된 사용자라면 SecurityContext에 등록해준다.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 인증이 필요 없는 경로는 필터를 건너뜀 (auth, swagger 등)
        if (publicUrlMatcher.matches(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 1. Authorization 헤더 추출
            String authorizationHeader = request.getHeader("Authorization");
            // 2. 토큰이 있는지 확인하고 Bearer로 시작하는지 검사
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                // 3. JWT 토큰 추출
                String token = authorizationHeader.substring(7); // Bearer 잘라내기

                // 4-1. 로그아웃 여부 확인(= 블랙리스트에 토큰이 있는지 확인)
                if (redisService.isBlacklisted(token)) {
                    log.warn("[JWT_BLACKLISTED] 블랙리스트에 있는 토큰: {}", token);
                    
                    // 클라이언트에게 에러 응답
                    sendErrorResponse(response, 401, "이미 로그아웃된 사용자입니다.", "JWT_BLACKLISTED", request.getRequestURI());
                    return;
                }

                // 4-2. JWT 토큰 유효성 검사
                if (jwtService.validateAccessToken(token, response)) {
                    // 토큰에서 사용자 식별자(PK) 추출
                    Long userId = jwtService.getUserId(token);
                    log.info("[JWT_USER_ID] 토큰에서 추출한 userId: {}", userId);

                    // 사용자 식별자로 UserDetails 조회
                    UserDetails userDetails = customUserDetailsService.loadUserByUserId(userId);

                    // 사용자 정보가 있으면, 인증 객체 생성 후 SecurityContext에 등록
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } else {
                log.warn("[JWT_MISSING] 헤더에 토큰이 없습니다. : {}", request.getRequestURI());
                
                // 클라이언트에게 에러 응답
                sendErrorResponse(response, 401, "헤더에 토큰이 없습니다.", "JWT_MISSING", request.getRequestURI());
                return;
            }
        } catch (BadCredentialsException | UsernameNotFoundException e) {
            log.warn("[JWT_AUTH_ERROR] 인증 오류: {}", e.getMessage());

            // 클라이언트에게 에러 응답
            sendErrorResponse(response, 401, e.getMessage(), "JWT_AUTH_ERROR", request.getRequestURI());
            return;
        }

        // 다음 필터로 이동
        filterChain.doFilter(request, response);
    }

    // JSON 형식의 ErrorResponse를 클라이언트에게 반환
    private void sendErrorResponse(HttpServletResponse response, int status, String message, String code, String path) throws IOException {
        ErrorResponse errorResponse = ErrorResponse.of(status, message, code, path);

        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");

        // JSON 형식으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}