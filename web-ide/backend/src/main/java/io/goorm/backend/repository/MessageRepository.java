package io.goorm.backend.repository;

import io.goorm.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // 메시지 생성 순으로 특정 채팅방의 채팅 조회
    List<Message> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);
}
