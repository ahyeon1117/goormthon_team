import { useAuthStore } from '../store/authStore';
import { getCurrentUserInfo } from '../api/userApi';

/**
 * 인증 관련 기능과 상태를 제공하는 커스텀 훅
 */
export function useAuth() {
  const {
    token,
    isAuthenticated,
    userId,
    login,
    logout,
    setToken,
    setUser
  } = useAuthStore();

  /**
   * 사용자가 인증되었는지 확인하는 함수
   */
  const checkAuth = (): boolean => {
    return isAuthenticated && !!token;
  };

  /**
   * 현재 인증된 사용자의 정보를 로드하는 함수
   * API 호출 후 스토어에 바로 저장합니다.
   */
  const loadUserInfo = async (): Promise<boolean> => {
    if (!isAuthenticated || !token) return false;
    const userInfo = await getCurrentUserInfo(true); // 스토어 자동 업데이트
    return !!userInfo;
  };

  return {
    // 상태
    token,
    isAuthenticated,
    userId,

    // 액션
    login,
    logout,
    setToken,
    setUser,
    loadUserInfo,

    // 유틸리티
    checkAuth,
  };
}
