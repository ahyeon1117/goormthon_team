package io.goorm.backend.config.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * STOMP 기반 WebSocket 설정
 * - 엔드포인트 설정, 브로커 설정, 인증 처리
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    // 요청 엔드포인트, CORS 설정, SockJS 사용 설정
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat") // 웹소켓 엔드포인트 설정
                .setAllowedOrigins("http://localhost:5173") // 프론트엔드 주소 (배포 시 실제 프론트엔드 도메인으로 변경해야 함)
                .withSockJS(); // SockJS 사용
    }


    // 메시지 브로커 설정: 메시지 발행/구독 경로 설정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); // 메시지 발행 요청 경로
        registry.enableSimpleBroker("/topic"); // 메시지 구독 요청 경로
    }

    // 인터셉터 설정: 웹소켓 요청(connect, disconnect, subscribe 등)을 가로채 JWT 토큰 인증
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }

}
