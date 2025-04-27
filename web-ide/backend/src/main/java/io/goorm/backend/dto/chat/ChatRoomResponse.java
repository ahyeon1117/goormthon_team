package io.goorm.backend.dto.chat;

import io.goorm.backend.entity.ChatRoom;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponse {
    private Long id;
    private String name;
    private Long projectId;
    
    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getName())
                .projectId(chatRoom.getProject().getId())
                .build();
    }
}
