import { apiRequest } from './client';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';

// 사용자 API 엔드포인트
const USER_API = {
  CURRENT_USER: '/api/v1/users/me',
};

// 사용자 권한 타입
export enum Authority {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// 사용자 정보 응답 인터페이스
export interface UserInfoResponse {
  userId: string;
  nickname: string;
  role: Authority;
  createdAt: string;
  updatedAt: string;
}

/**
 * 현재 로그인한 사용자의 정보를 조회하는 함수
 * @param updateStore 조회 성공 시 스토어에 정보를 업데이트할지 여부
 */
export const getCurrentUserInfo = async (updateStore: boolean = false): Promise<UserInfoResponse | null> => {
  try {
    console.log('사용자 정보 조회 중...');

    const response = await apiRequest.get<UserInfoResponse>(USER_API.CURRENT_USER);
    if (response.data.code === 200 && response.data.data) {
      const userInfo = response.data.data;
      console.log('사용자 정보 조회 성공:', userInfo.userId);

      // 스토어 업데이트 옵션이 활성화된 경우
      if (updateStore) {
        const userStore = useUserStore.getState();
        userStore.setUserInfo(
          userInfo.userId,
          userInfo.nickname,
          userInfo.role,
          userInfo.createdAt,
          userInfo.updatedAt
        );
      }

      return userInfo;
    }

    console.error('사용자 정보 조회 실패:', response.data.msg);
    return null;
  } catch (error) {
    console.error('사용자 정보 조회 API 호출 중 오류 발생:', error);
    return null;
  }
};

/**
 * 사용자의 권한 레벨을 확인하는 유틸리티 함수
 */
export const isAdmin = (userInfo: UserInfoResponse | null): boolean => {
  if (!userInfo) return false;
  return userInfo.role === Authority.ADMIN;
};

/**
 * 사용자 로그인 여부를 확인하는 유틸리티 함수
 */
export const isLoggedIn = (): boolean => {
  // authStore의 isAuthenticated 상태를 활용
  const authStore = useAuthStore.getState();
  return authStore.isAuthenticated;
};

/**
 * 사용자 로그아웃 함수
 * authStore의 logout 함수를 호출하여 일관된 로그아웃 처리
 */
export const logout = (): void => {
  const authStore = useAuthStore.getState();
  authStore.logout();
};
