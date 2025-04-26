package io.goorm.backend.controller;

import io.goorm.backend.dto.chat.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

/**
 * 클라이언트로부터 STOMP 메시지를 수신하고, 해당 채팅방 구독자에게 메시지를 전송하는 WebSocket 컨트롤러
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class StompController {

    private final SimpMessageSendingOperations messageTemplate;

    @MessageMapping("/{roomId}") // /publish/{roomId}로 발행된 메시지를 수신
    public void sendMessage(@DestinationVariable Long roomId, ChatMessageDTO chatMessageDTO) {
        log.info("[CHAT_MESSAGE] 전송된 메시지: {}", chatMessageDTO);

        // 해당 채팅방 구독자에게 메시지 전송
        messageTemplate.convertAndSend("/topic/" + roomId, chatMessageDTO);
    }
}