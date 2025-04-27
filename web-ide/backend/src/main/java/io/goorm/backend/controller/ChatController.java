package io.goorm.backend.controller;

import io.goorm.backend.dto.chat.ChatMessageDTO;
import io.goorm.backend.dto.chat.ChatRoomResponse;
import io.goorm.backend.global.response.ApiResponse;
import io.goorm.backend.service.ChatService;
import io.goorm.backend.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "채팅 API")
public class ChatController {

    private final ChatService chatService;
    private final JwtService jwtService;

    /**
     * 프로젝트 채팅방 정보 조회 API
     * @param projectId 프로젝트 ID
     * @return 프로젝트 채팅방 정보
     */
    @GetMapping("/projects/{projectId}")
    @Operation(summary = "프로젝트 채팅방 조회", description = "프로젝트별 채팅방 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<ChatRoomResponse>> getChatRoomByProjectId(@PathVariable Long projectId) {
        Long userId = jwtService.getUserId();
        ChatRoomResponse chatRoomResponse = chatService.getChatRoomByProjectId(projectId, userId);

        return ResponseEntity.ok(ApiResponse.success(chatRoomResponse, "프로젝트 채팅방 정보 조회"));
    }

    /**
     * 채팅 내역 조회 API
     * @param roomId 채팅방 ID
     * @return 채팅 내역
     */
    @GetMapping("/rooms/{roomId}/messages")
    @Operation(summary = "채팅 메시지 내역 조회", description = "채팅 메시지 내역을 조회합니다.")
    public ResponseEntity<ApiResponse<List<ChatMessageDTO>>> getChatHistory(@PathVariable Long roomId) {
        Long userId = jwtService.getUserId();
        List<ChatMessageDTO> messages = chatService.getMessageHistory(roomId, userId);

        return ResponseEntity.ok(ApiResponse.success(messages, "채팅방 메시지 조회"));
    }
    
}
