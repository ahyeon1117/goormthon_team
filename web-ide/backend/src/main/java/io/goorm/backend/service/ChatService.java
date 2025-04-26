package io.goorm.backend.service;

import io.goorm.backend.dto.chat.ChatMessageDTO;
import io.goorm.backend.dto.chat.ChatRoomResponse;
import io.goorm.backend.entity.ChatRoom;
import io.goorm.backend.entity.Message;
import io.goorm.backend.entity.User;
import io.goorm.backend.global.exception.ChatException;
import io.goorm.backend.repository.ChatRoomRepository;
import io.goorm.backend.repository.MessageRepository;
import io.goorm.backend.repository.ProjectMemberRepository;
import io.goorm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    /**
     * 프로젝트 멤버 검증 (공통 메서드)
     */
    private void validateProjectMember(Long projectId, Long userId) {
        // - existsByProject_IdAndUser_Id: project_members 테이블에서 특정 project_id와 user_id가 모두 일치하는 레코드가 있는지 확인 ()
        boolean isMember = projectMemberRepository.existsByProject_IdAndUser_Id(projectId, userId);

        if (!isMember) {
            throw new ChatException("이 프로젝트에 접근할 권한이 없습니다.");
        }
    }

    /**
     * 프로젝트 ID로 채팅방 정보 조회 (프로젝트 멤버 여부 검증 추가)
     */
    @Transactional(readOnly = true)
    public ChatRoomResponse getChatRoomByProjectId(Long projectId, Long userId) {

        // 프로젝트 멤버 검증
        validateProjectMember(projectId, userId);

        // 프로젝트 ID로 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository.findByProjectId(projectId)
                .orElseThrow(() -> new ChatException("채팅방을 찾을 수 없습니다."));

        // DTO로 변환하여 반환
        return ChatRoomResponse.from(chatRoom);
    }

    /**
     * 채팅 메시지 저장
     * 
     * @param roomId
     * @param chatMessageDTO
     */
    @Transactional
    public void saveMessage(Long roomId, ChatMessageDTO chatMessageDTO) {

        // 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatException("채팅방을 찾을 수 없습니다."));

        // 유저 조회
        User user = userRepository.findById(chatMessageDTO.getSenderId())
                .orElseThrow(() -> new ChatException("사용자를 찾을 수 없습니다."));

        // 메시지 엔티티 생성 및 저장
        Message message = new Message(chatRoom, user, chatMessageDTO.getMessage());
        messageRepository.save(message);
    }

    /**
     * 채팅방 과거 메시지 조회 (프로젝트 멤버 여부 검증 추가)
     */
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessageHistory(Long roomId, Long userId) {

        // 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatException("채팅방을 찾을 수 없습니다."));

        // 프로젝트 ID 조회
        Long projectId = chatRoom.getProject().getId();

        // 프로젝트 멤버 검증
        validateProjectMember(projectId, userId);

        // 메시지 리스트 조회
        List<Message> messages = messageRepository.findByChatRoomIdOrderByCreatedAtAsc(roomId);

        return messages.stream()
                .map(m -> new ChatMessageDTO(
                        m.getUser().getId(),
                        m.getUser().getUsername(),
                        m.getContent(),
                        m.getCreatedAt().toString()))
                .collect(Collectors.toList());
    }

}
