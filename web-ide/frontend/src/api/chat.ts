import { ApiResponse, ChatRoomResponse, ChatMessageDTO } from '../types/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';

// 채팅방 정보 조회 API
export const fetchChatRoom = async (projectId: number): Promise<ChatRoomResponse> => {
  const res = await fetchWithAuth(`/api/v1/chat/projects/${projectId}`, {
    method: 'GET',
  });
  
  if (!res.ok) throw new Error('채팅방 정보 조회 실패');

  const response: ApiResponse<ChatRoomResponse> = await res.json();
  return response.data; // ApiResponse의 data 필드 반환
};

// 이전 채팅 메시지 조회 API 
export const fetchChatHistory = async (roomId: number): Promise<ChatMessageDTO[]> => {
  const res = await fetchWithAuth(`/api/v1/chat/rooms/${roomId}/messages`, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('채팅 메시지 조회 실패');

  const response: ApiResponse<ChatMessageDTO[]> = await res.json();
  return response.data; // 메시지 배열
};
