package io.goorm.backend.repository;

import io.goorm.backend.entity.ChatRoom;
import io.goorm.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // 프로젝트 ID로 채팅방 조회
    Optional<ChatRoom> findByProjectId(Long projectId); // 일단, 프로젝트:채팅방 = 1:1 관계로 구현

    Optional<ChatRoom> findByProject(Project project);
}
