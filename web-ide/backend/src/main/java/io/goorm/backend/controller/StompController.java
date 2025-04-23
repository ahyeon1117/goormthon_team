package io.goorm.backend.controller;

import io.goorm.backend.dto.chat.ChatMessageRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

/**
 * 클라이언트로부터 STOMP 메시지를 수신하고, 해당 채팅방 구독자에게 메시지를 전달하는 WebSocket 컨트롤러
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class StompController {

    private final SimpMessageSendingOperations messageTemplate;

    /**
     * 클라이언트에서 /app/{roomId}로 전송한 메시지를 수신하여
     * 해당 채팅방 구독자에게 /topic/{roomId} 경로로 메시지를 전달
     * 
     * @param roomId 채팅방 ID
     * @param chatMessageRequest 전송된 메시지 DTO
     */
    @MessageMapping("/{roomId}") // /app/{roomId}로 전송한 메시지를 수신
    public void sendMessage(@DestinationVariable Long roomId, ChatMessageRequest chatMessageRequest) {
        log.info("[CHAT_MESSAGE] 전송된 메시지: {}", chatMessageRequest);
        messageTemplate.convertAndSend("/topic/" + roomId, chatMessageRequest); // 해당 채팅방 구독자에게 메시지 전송
    }
}