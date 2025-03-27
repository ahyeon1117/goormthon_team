import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { useUserStore } from './userStore';

// 인증 스토어 상태 타입 정의
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userId: string | null;

  // 액션
  setToken: (token: string) => void;
  setUser: (userId: string) => void;
  login: (token: string, userId: string, nickname: string) => void;
  logout: () => void;
}

// 인증 스토어 생성
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      userId: null,

      // 토큰 설정
      setToken: (token: string) => {
        // API 클라이언트의 기본 헤더에 인증 토큰 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, isAuthenticated: !!token });
      },

      // 사용자 ID 설정
      setUser: (userId: string) => {
        set({ userId });
      },

      // 로그인 (토큰 및 사용자 정보 설정)
      login: (token: string, userId: string, nickname: string) => {
        // API 클라이언트의 기본 헤더에 인증 토큰 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 인증 스토어 상태 업데이트
        set({
          token,
          isAuthenticated: true,
          userId
        });

        // 사용자 스토어에도 정보 저장
        const userStore = useUserStore.getState();
        userStore.setUserInfo(userId, nickname);
      },

      // 로그아웃
      logout: () => {
        // API 클라이언트의 기본 헤더에서 인증 토큰 제거
        delete axios.defaults.headers.common['Authorization'];

        // 인증 스토어 상태 초기화
        set({
          token: null,
          isAuthenticated: false,
          userId: null
        });

        // 사용자 스토어도 초기화
        const userStore = useUserStore.getState();
        userStore.clearUserInfo();
      }
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
    }
  )
);
