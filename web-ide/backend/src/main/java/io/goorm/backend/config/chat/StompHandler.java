package io.goorm.backend.config.chat;

import io.goorm.backend.global.exception.UnauthorizedStompException;
import io.goorm.backend.service.JwtService;
import io.goorm.backend.service.auth.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

/**
 * 웹소켓 연결 요청 시 JWT 토큰을 검증하는 핸들러
 * 
 * WebSocket 연결은 JwtAuthFilter를 거치지 않기 때문에, 이 핸들러에서 별도로 검증해야 함
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtService jwtService;
    private final RedisService redisService;

    /**
     * 웹소켓 연결 및 메시지 전송 전에 실행되는 메서드
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        // StompHeaderAccessor.wrap(message): STOMP 메시지에서 헤더 정보(토큰 포함)를 추출
        final StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // 웹소켓 연결 요청일 경우만 처리
        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            log.info("[STOMP_HANDLER] 웹소켓 CONNECT 요청 - 토큰 검증 시작");

            // Authorization 헤더 추출
            String bearerToken = accessor.getFirstNativeHeader("Authorization");

            // 1. Bearer 형식 확인
            if(bearerToken == null || !bearerToken.startsWith("Bearer ")) {
                log.warn("[STOMP_HANDLER] Authorization 헤더 누락");
                throw new UnauthorizedStompException("Authorization 헤더가 없습니다.");
            }

            // 2. JWT 토큰 추출
            String token = bearerToken.substring(7);

            // 3. 로그아웃 여부 확인(= 블랙리스트에 토큰이 있는지 확인)
            if(redisService.isBlacklisted(token)) {
                log.warn("[STOMP_HANDLER] 이미 로그아웃된 사용자입니다.");
                throw new UnauthorizedStompException("이미 로그아웃된 사용자입니다.");
            }

            // 토큰 유효성 검증
            if(!jwtService.validateAccessToken(token)) {
                log.warn("[STOMP_HANDLER] 유효하지 않은 JWT 토큰입니다.");
                throw new UnauthorizedStompException("유효하지 않은 JWT 토큰입니다.");
            }

            // 토큰에서 userId 추출
            Long userId = jwtService.getUserId(token);
            log.info("[STOMP_HANDLER] 토큰 검증 완료: {}", userId);
        }
        return message;
    }

}
