package io.goorm.backend.global.filter;

import io.goorm.backend.service.auth.CustomUserDetailsService;
import io.goorm.backend.service.JwtService;
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

                // 4. JWT 토큰 유효성 검사
                if (jwtService.validateAccessToken(token, response)) {
                    // 4-1. 토큰에서 사용자 식별자(PK) 추출
                    Long userId = jwtService.getUserId(token);
                    log.debug("[JWT_AUTH_FILTER] 토큰에서 추출한 userId: {}", userId);

                    // 4-2. 사용자 식별자로 UserDetails 조회
                    UserDetails userDetails = customUserDetailsService.loadUserByUserId(userId);

                    // UserDetails userDetails = userDetailsService.loadUserByUsername(userId.toString()); // DB에서 사용자 ID(PK)로 사용자 정보 조회

                    // 4-3. 사용자 정보가 있으면, 인증 객체 생성 후 SecurityContext에 등록
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } else {
                log.warn("[JWT_MISSING] 인증 헤더 없음 또는 형식 오류: {}", request.getRequestURI());
                throw new BadCredentialsException("It is Not Token in Header");
            }
        } catch (BadCredentialsException | UsernameNotFoundException e) {
            log.warn("[JWT_AUTH_ERROR] 인증 오류: {}", e.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(e.getMessage());
            return;
        }

        // 다음 필터로 이동
        filterChain.doFilter(request, response);
    }
}