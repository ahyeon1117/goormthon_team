import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Authority } from '../api/userApi';

// 사용자 정보 스토어 상태 타입 정의
interface UserState {
  userId: string | null;
  nickname: string | null;
  role: Authority | null;
  createdAt: string | null;
  updatedAt: string | null;

  // 액션
  setUserInfo: (userId: string, nickname: string, role?: Authority, createdAt?: string, updatedAt?: string) => void;
  updateNickname: (nickname: string) => void;
  clearUserInfo: () => void;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      nickname: null,
      role: null,
      createdAt: null,
      updatedAt: null,

      // 사용자 정보 설정
      setUserInfo: (userId: string, nickname: string, role?: Authority, createdAt?: string, updatedAt?: string) => {
        set({
          userId,
          nickname,
          role: role || null,
          createdAt: createdAt || null,
          updatedAt: updatedAt || null
        });
      },

      // 닉네임 업데이트
      updateNickname: (nickname: string) => {
        set({ nickname });
      },

      // 사용자 정보 초기화
      clearUserInfo: () => {
        set({
          userId: null,
          nickname: null,
          role: null,
          createdAt: null,
          updatedAt: null
        });
      },

      // 관리자 권한 확인
      isAdmin: () => {
        return get().role === Authority.ADMIN;
      }
    }),
    {
      name: 'user-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
    }
  )
);
